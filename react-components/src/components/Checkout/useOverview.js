/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2019 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
import { useMutation } from '@apollo/client';
import { useState } from 'react';

import MUTATION_PLACE_ORDER from '../../queries/mutation_place_order.graphql';
import QUERY_CUSTOMER_CART from '../../queries/query_customer_cart.graphql';

import { useAddressForm } from '../AddressForm/useAddressForm';
import { useAwaitQuery, useStorefrontEvents } from '../../utils/hooks';
import { useCartState } from '../Minicart/cartContext';
import { useCheckoutState } from './checkoutContext';
import { useUserContext } from '../../context/UserContext';
import * as dataLayerUtils from '../../utils/dataLayerUtils';

export default () => {
    const [
        { shippingAddress, billingAddress, billingAddressSameAsShippingAddress, shippingMethod, paymentMethod },
        checkoutDispatch
    ] = useCheckoutState();
    const [{ cart, cartId }, cartDispatch] = useCartState();
    const [{ isSignedIn }, { resetCustomerCart }] = useUserContext();
    const fetchCustomerCartQuery = useAwaitQuery(QUERY_CUSTOMER_CART);
    const { findSavedAddress } = useAddressForm();

    const [placeOrder] = useMutation(MUTATION_PLACE_ORDER);
    const [inProgress, setInProgress] = useState(false);

    const mse = useStorefrontEvents();

    const editShippingAddress = address => {
        if (!findSavedAddress(address)) {
            checkoutDispatch({ type: 'setIsEditingNewAddress', editing: true });
        }
        checkoutDispatch({ type: 'setEditing', editing: 'address' });
    };

    const editBillingInformation = address => {
        if (!findSavedAddress(address) || billingAddressSameAsShippingAddress) {
            checkoutDispatch({ type: 'setIsEditingNewAddress', editing: true });
        }
        checkoutDispatch({ type: 'setEditing', editing: 'paymentMethod' });
    };

    const submitOrder = async () => {
        setInProgress(true);
        // we set the progress to `false` *before* dispatching because the component
        // will be unmounted and the `setInProgress` call will trigger a React warning
        try {
            const { data } = await placeOrder({ variables: { cartId } });
            checkoutDispatch({ type: 'placeOrder', order: data.placeOrder.order });

            const {
                placeOrder: {
                    order: { order_id }
                }
            } = data;

            const {
                email,
                applied_coupon,
                prices: {
                    subtotal_excluding_tax: { value: subtotalExcludingTax },
                    subtotal_including_tax: { value: subtotalIncludingTax },
                    grand_total: { currency, value: priceTotal }
                },
                selected_payment_method: { code: paymentCode, title: paymentName },
                items
            } = cart;

            dataLayerUtils.pushEvent('cif:placeOrder', {
                'xdm:purchaseOrderNumber': order_id,
                'xdm:currencyCode': currency,
                'xdm:priceTotal': priceTotal,
                'xdm:payments': [
                    {
                        'xdm:paymentAmount': priceTotal,
                        'xdm:paymentType': paymentCode,
                        'xdm:currencyCode': currency
                    }
                ],
                'xdm:products': await Promise.all(
                    items.map(async item => {
                        const {
                            product: { sku },
                            quantity
                        } = item;
                        return {
                            '@id': await dataLayerUtils.generateDataLayerId('product', sku),
                            'xdm:SKU': sku,
                            'xdm:quantity': quantity
                        };
                    })
                )
            });

            mse &&
                mse.context.setOrder({
                    appliedCouponCode: applied_coupon ? applied_coupon.code : '',
                    email: email,
                    grandTotal: priceTotal,
                    orderId: order_id,
                    otherTax: priceTotal - subtotalIncludingTax,
                    paymentMethodCode: paymentCode,
                    paymentMethodName: paymentName,
                    salesTax: subtotalIncludingTax - subtotalExcludingTax,
                    subtotalExcludingTax: subtotalExcludingTax,
                    subtotalIncludingTax: subtotalIncludingTax
                });
            mse && mse.publish.placeOrder();

            // if user is signed in reset the cart
            if (isSignedIn) {
                resetCustomerCart(fetchCustomerCartQuery);
            }
            cartDispatch({ type: 'reset' });
            return data;
        } catch (error) {
            console.error(error);
            cartDispatch({ type: 'error', error: error.toString() });
        } finally {
            setInProgress(false);
        }
    };

    return [
        { shippingAddress, billingAddress, shippingMethod, paymentMethod, inProgress, cart },
        { editShippingAddress, editBillingInformation, placeOrder: submitOrder, checkoutDispatch }
    ];
};

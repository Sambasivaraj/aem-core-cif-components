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

import MUTATION_REMOVE_ITEM from '../../queries/mutation_remove_item.graphql';
import CART_DETAILS_QUERY from '../../queries/query_cart_details.graphql';

import { removeItemFromCart } from '../../actions/cart';
import { useCartState } from './cartContext';
import { useAwaitQuery, useStorefrontEvents } from '../../utils/hooks';
import * as dataLayerUtils from '../../utils/dataLayerUtils';

export default props => {
    const { item } = props;
    const [{ cartId }, dispatch] = useCartState();
    const mse = useStorefrontEvents();

    const [removeItemMutation] = useMutation(MUTATION_REMOVE_ITEM);
    const cartDetailsQuery = useAwaitQuery(CART_DETAILS_QUERY);

    const editItem = () => {
        dispatch({ type: 'beginEditing', item: item });
    };

    const removeItem = async itemUid => {
        dispatch({ type: 'beginLoading' });
        await removeItemFromCart({ cartId, itemUid, dispatch, cartDetailsQuery, removeItemMutation });
        dispatch({ type: 'endLoading' });

        mse && mse.publish.removeFromCart();
        dataLayerUtils.pushEvent('cif:removeFromCart', {
            '@id': await dataLayerUtils.generateDataLayerId('product', item.product.sku),
            'xdm:SKU': item.product.sku,
            'xdm:quantity': item.quantity
        });
    };

    return [{}, { removeItem, editItem }];
};

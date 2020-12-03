/*******************************************************************************
 *
 *    Copyright 2020 Adobe. All rights reserved.
 *    This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License. You may obtain a copy
 *    of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under
 *    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *    OF ANY KIND, either express or implied. See the License for the specific language
 *    governing permissions and limitations under the License.
 *
 ******************************************************************************/
import React from 'react';
import { array, func, bool, number, string } from 'prop-types';

import Price from '../../Price';


const Checkbox = props => {

    const { option_id, options, customization, currencyCode, handleSelectionChange } = props;

    const onChange = event => {
        const { checked, value } = event.target;
        let newCustomization;

        if (checked) {
            newCustomization = [...customization];
            const option = options.find(o => o.id == value);
            newCustomization.push(option);
        } else {
            newCustomization = customization.filter(c => c.id != value);
        }

        handleSelectionChange(option_id, newCustomization);
    }

    return (
        <>
            {options.map(o => (
                <div key={`option-${option_id}-${o.id}`} className="product__option">
                    <label>
                        <input
                            type="checkbox"
                            checked={customization.findIndex(c => c.id === o.id) > -1}
                            onChange={onChange}
                            value={o.id}
                        />{` ${o.label} +`}
                        <b>
                            <Price currencyCode={currencyCode} value={o.price} />
                        </b>
                    </label>
                </div>
            ))}
        </>
    );
}

Checkbox.propTypes = {
    required: bool.isRequired,
    option_id: number.isRequired,
    customization: array.isRequired,
    options: array.isRequired,
    currencyCode: string.isRequired,
    handleSelectionChange: func.isRequired,
};

export default Checkbox;
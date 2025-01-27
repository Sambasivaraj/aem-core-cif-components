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
import React from 'react';
import { arrayOf, node, number, oneOfType, shape, string } from 'prop-types';
import { BasicSelect, Option, asField } from 'informed';

import { FieldIcons, Message } from '../Field';
import classes from './select.css';

import Icon from '../Icon';
import { ChevronDown as ChevronDownIcon } from 'react-feather';

const arrow = <Icon src={ChevronDownIcon} size={18} />;

const Select = props => {
    const { fieldState, items, message, ...rest } = props;
    const options = items.map(({ label, value }) => (
        <Option key={value} value={value}>
            {label || (value != null ? value : '')}
        </Option>
    ));

    return (
        <>
            <FieldIcons after={arrow}>
                <BasicSelect {...rest} fieldState={fieldState} className={classes.input}>
                    {options}
                </BasicSelect>
            </FieldIcons>
            <Message fieldState={fieldState}>{message}</Message>
        </>
    );
};

Select.propTypes = {
    classes: shape({
        input: string
    }),
    field: string.isRequired,
    fieldState: shape({
        value: oneOfType([number, string])
    }),
    items: arrayOf(
        shape({
            label: string,
            value: oneOfType([number, string])
        })
    ),
    message: node
};

export default asField(Select);

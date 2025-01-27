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
import { bool, node, shape, string } from 'prop-types';
import { BasicCheckbox, asField } from 'informed';

import { Message } from '../Field';
import Icon from '../Icon';
import { Check as CheckIcon } from 'react-feather';
import classes from './checkbox.css';

const Checkbox = props => {
    const { fieldState, id, label, message, ...rest } = props;
    const { value: checked } = fieldState;

    return (
        <>
            <label className={classes.root} htmlFor={id}>
                <span className={classes.icon}>{checked && <Icon src={CheckIcon} size={18} />}</span>
                <BasicCheckbox {...rest} className={classes.input} fieldState={fieldState} id={id} />
                <span className={classes.label}>{label}</span>
            </label>
            <Message fieldState={fieldState}>{message}</Message>
        </>
    );
};

Checkbox.propTypes = {
    classes: shape({
        icon: string,
        input: string,
        label: string,
        message: string,
        root: string
    }),
    field: string.isRequired,
    fieldState: shape({
        value: bool
    }).isRequired,
    id: string,
    label: node.isRequired,
    message: node
};

export default asField(Checkbox);

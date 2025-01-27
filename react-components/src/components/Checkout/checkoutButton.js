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
import { bool, func } from 'prop-types';
import { useIntl } from 'react-intl';

import Button from '../Button';
import Icon from '../Icon';
import { Lock as LockIcon } from 'react-feather';

const CheckoutButton = ({ disabled, onClick }) => {
    const intl = useIntl();

    return (
        <Button priority="high" disabled={disabled} onClick={onClick}>
            <Icon src={LockIcon} size={16} />
            <span>{intl.formatMessage({ id: 'checkout:checkout', defaultMessage: 'Checkout' })}</span>
        </Button>
    );
};

CheckoutButton.propTypes = {
    disabled: bool,
    onClick: func
};

export default CheckoutButton;

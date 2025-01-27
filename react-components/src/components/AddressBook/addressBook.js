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
import { useIntl } from 'react-intl';

import { useUserContext } from '../../context/UserContext';
import AddressItemsContainer from './addressItemsContainer';
import AddressFormContainer from './addressFormContainer';

import classes from './addressBook.css';

const AddressBook = () => {
    const [{ isSignedIn }] = useUserContext();
    const intl = useIntl();

    const content = isSignedIn ? (
        <>
            <AddressItemsContainer />
            <AddressFormContainer />
        </>
    ) : (
        <div className={classes.text}>
            {intl.formatMessage({
                id: 'account:address-book-sign-in-text',
                defaultMessage: 'Please Sign in to see your address book.'
            })}
        </div>
    );

    return (
        <div className={classes.root}>
            <h1 className={classes.title}>
                {intl.formatMessage({ id: 'account:address-book', defaultMessage: 'Address Book' })}
            </h1>
            {content}
        </div>
    );
};

export default AddressBook;

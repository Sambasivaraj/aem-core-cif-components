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
import { func } from 'prop-types';
import { useIntl } from 'react-intl';

import ForgotPasswordForm from './forgotPasswordForm';
import FormSubmissionSuccessful from './formSubmissionSuccessful';
import useForgotPassword from './useForgotPassword';
import LoadingIndicator from '../LoadingIndicator';

import classes from './forgotPassword.css';

const ForgotPassword = props => {
    const { onClose, onCancel } = props;

    const [{ loading, submitted, email }, { handleFormSubmit }] = useForgotPassword();
    const intl = useIntl();

    let content;

    if (loading) {
        content = (
            <LoadingIndicator>
                {intl.formatMessage({ id: 'common:loading', defaultMessage: 'Loading' })}
            </LoadingIndicator>
        );
    } else if (submitted) {
        content = <FormSubmissionSuccessful email={email} onContinue={onClose} />;
    } else {
        content = (
            <>
                <p className={classes.instructions}>
                    {intl.formatMessage({
                        id: 'account:reset-password-instructions',
                        defaultMessage: 'Enter your email below to receive a password reset link.'
                    })}
                </p>
                <ForgotPasswordForm handleFormSubmit={handleFormSubmit} handleCancel={onCancel} />
            </>
        );
    }

    return <div className={classes.root}>{content}</div>;
};

ForgotPassword.propTypes = {
    onClose: func.isRequired,
    onCancel: func.isRequired
};

export default ForgotPassword;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
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
import React, { Fragment, useEffect } from 'react';
import { bool, func } from 'prop-types';
import { useIntl } from 'react-intl';
import { useFormApi, useFormState } from 'informed';

import Field from '../Field';
import LinkButton from '../LinkButton';
import TextInput from '../TextInput';
import Password from '../Password';
import combine from '../../utils/combineValidators';
import { isRequired, validatePassword, hasLengthAtLeast, isNotEqualToField } from '../../utils/formValidators';

import classes from './editForm.css';

const EditForm = props => {
    const { shouldShowNewPassword, handleShowNewPasswordField } = props;
    const intl = useIntl();

    const maybeShowChangePasswordButton = !shouldShowNewPassword && (
        <div className={classes.changePasswordButtonContainer}>
            <LinkButton
                type="button"
                classes={{ root: classes.changePasswordButton }}
                onClick={handleShowNewPasswordField}>
                {intl.formatMessage({ id: 'account:change-password', defaultMessage: 'Change Password' })}
            </LinkButton>
        </div>
    );

    const maybeShowNewPasswordField = shouldShowNewPassword ? (
        <div className={classes.newPassword}>
            <Password
                fieldName="newPassword"
                label={intl.formatMessage({ id: 'account:new-password', defaultMessage: 'New Password' })}
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, 8],
                    validatePassword,
                    [isNotEqualToField, 'password']
                ])}
                isToggleButtonHidden={false}
            />
        </div>
    ) : null;
    const passwordLabel = shouldShowNewPassword
        ? intl.formatMessage({ id: 'account:current-password', defaultMessage: 'Current Password' })
        : intl.formatMessage({ id: 'account:password', defaultMessage: 'Password' });

    const formState = useFormState();
    const formApi = useFormApi();
    const { submits, invalid } = formState;

    useEffect(() => {
        if (!invalid) {
            // clear the password field on a successful submit
            formApi.setValue('password', '');
        }
    }, [submits, invalid]);

    return (
        <Fragment>
            <div className={classes.root}>
                <div className={classes.firstname}>
                    <Field
                        id="firstname"
                        label={intl.formatMessage({ id: 'account:firstname', defaultMessage: 'First Name' })}>
                        <TextInput field="firstname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field
                        id="lastname"
                        label={intl.formatMessage({ id: 'account:lastname', defaultMessage: 'Last Name' })}>
                        <TextInput field="lastname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.email}>
                    <Field
                        id="email"
                        label={intl.formatMessage({ id: 'account:email', defaultMessage: 'Email address' })}>
                        <TextInput field="email" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.password}>
                    <Password
                        fieldName="password"
                        label={passwordLabel}
                        validate={isRequired}
                        autoComplete="current-password"
                        isToggleButtonHidden={false}
                    />
                </div>
                {maybeShowChangePasswordButton}
            </div>
            {maybeShowNewPasswordField}
        </Fragment>
    );
};

export default EditForm;

EditForm.propTypes = {
    shouldShowNewPassword: bool,
    handleShowNewPasswordField: func
};

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
import React from 'react';
import { object, bool, func, array } from 'prop-types';
import { useIntl } from 'react-intl';
import { useConfigContext } from '../../context/ConfigContext';
import Dialog from '../Dialog';
import FormError from '../FormError';

import EditForm from './editForm';

const EditModal = props => {
    const {
        initialValues,
        isOpen,
        onCancel,
        onSubmit,
        isDisabled,
        onChangePassword,
        shouldShowNewPassword,
        formErrors
    } = props;
    const intl = useIntl();

    const {
        mountingPoints: { accountDetails: rootSelector }
    } = useConfigContext();

    const dialogFormProps = { initialValues };

    return (
        <Dialog
            confirmText="Save"
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onSubmit}
            shouldDisableAllButtons={isDisabled}
            shouldDisableConfirmButton={isDisabled}
            title={intl.formatMessage({ id: 'account:edit-account-info', defaultMessage: 'Edit account information' })}
            rootContainerSelector={rootSelector}
            isModal={true}>
            <FormError errors={formErrors} />
            <EditForm handleShowNewPasswordField={onChangePassword} shouldShowNewPassword={shouldShowNewPassword} />
        </Dialog>
    );
};

export default EditModal;

EditModal.propTypes = {
    initialValues: object.isRequired,
    isOpen: bool,
    onCancel: func.isRequired,
    onSubmit: func.isRequired,
    isDisabled: bool,
    onChangePassword: func.isRequired,
    shouldShowNewPassword: bool,
    formErrors: array
};

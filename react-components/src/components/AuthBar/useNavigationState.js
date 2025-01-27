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
import { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useEventListener } from '../../utils/hooks';
import { useConfigContext } from '../../context/ConfigContext';

// DOM events that are used to talk to the navigation panel
const events = {
    START_ACC_MANAGEMENT: 'aem.accmg.start',
    EXIT_ACC_MANAGEMENT: 'aem.accmg.exit'
};

const ancestors = {
    CREATE_ACCOUNT: 'SIGN_IN',
    FORGOT_PASSWORD: 'SIGN_IN',
    ACCOUNT_CREATED: 'MENU',
    MY_ACCOUNT: 'MENU',
    CHANGE_PASSWORD: 'MY_ACCOUNT',
    SIGN_IN: 'MENU',
    MENU: null
};

const stepTitles = {
    CREATE_ACCOUNT: intl => intl.formatMessage({ id: 'account:create-account', defaultMessage: 'Create account' }),
    FORGOT_PASSWORD: intl =>
        intl.formatMessage({ id: 'account:password-recovery', defaultMessage: 'Password recovery' }),
    CHANGE_PASSWORD: intl => intl.formatMessage({ id: 'account:change-password', defaultMessage: 'Change Password' }),
    MY_ACCOUNT: intl => intl.formatMessage({ id: 'account:my-account', defaultMessage: 'My account' }),
    ACCOUNT_CREATED: intl => intl.formatMessage({ id: 'account:account-created', defaultMessage: 'Account created' }),
    SIGN_IN: intl => intl.formatMessage({ id: 'account:sign-in', defaultMessage: 'Sign In' })
};

const startAccMgEvent = new CustomEvent(events.START_ACC_MANAGEMENT);
const exitAccMgEvent = new CustomEvent(events.EXIT_ACC_MANAGEMENT);

const useNavigationState = (props = { view: 'MENU' }) => {
    const [currentView, setCurrentView] = useState(props.view);
    const intl = useIntl();

    const {
        mountingPoints: { navPanel }
    } = useConfigContext();

    const navigationPanel = document.querySelector(navPanel);

    const triggerNavigationEvent = title => {
        const event = new CustomEvent('aem.accmg.step', { detail: { title } });
        triggerEvent(event);
    };

    const triggerEvent = event => navigationPanel && navigationPanel.dispatchEvent(event);

    const handleBack = useCallback(() => {
        if (currentView === null) {
            return;
        }
        const parent = ancestors[currentView];
        if (parent === 'MENU') {
            // no parent view means we're out of the account management process and back to navigation
            // so we're resetting the title
            showMenu();
            return;
        }
        if (parent === 'MY_ACCOUNT') {
            showMyAccount();
            return;
        }
        if (parent) {
            switchTo(parent);
        }
    }, [currentView]);

    useEventListener(document, 'aem.navigation.back', handleBack);

    const switchTo = view => {
        triggerNavigationEvent(stepTitles[view](intl));
        setCurrentView(view);
    };

    const showSignIn = () => {
        triggerEvent(startAccMgEvent);
        switchTo('SIGN_IN');
    };
    const showMenu = () => {
        triggerEvent(exitAccMgEvent);
        setCurrentView('MENU');
    };
    const showMyAccount = () => {
        dispatchEvent(startAccMgEvent);
        switchTo('MY_ACCOUNT');
    };
    const showChangePassword = () => {
        switchTo('CHANGE_PASSWORD');
    };
    const showCreateAccount = () => {
        switchTo('CREATE_ACCOUNT');
    };
    const showForgotPassword = () => {
        switchTo('FORGOT_PASSWORD');
    };
    const showAccountCreated = () => {
        switchTo('ACCOUNT_CREATED');
    };

    const api = {
        showSignIn,
        showMenu,
        showMyAccount,
        showChangePassword,
        showForgotPassword,
        showCreateAccount,
        showAccountCreated
    };

    return [currentView, { ...api, switchTo, handleBack }];
};

export default useNavigationState;

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
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import { CommerceApp, Portal, ConfigContextProvider, BundleProductOptions } from '@adobe/aem-core-cif-react-components';

import loadLocaleData from './i18n';
import partialConfig from './config';

const App = props => {
    const { storeView, graphqlEndpoint, graphqlMethod } = document.querySelector('body').dataset;
    const { mountingPoints } = partialConfig;
    const { locale, messages } = props;

    const config = {
        ...partialConfig,
        storeView,
        graphqlEndpoint,
        // Can be GET or POST. When selecting GET, this applies to cache-able GraphQL query requests only. Mutations
        // will always be executed as POST requests.
        graphqlMethod
    };

    return (
        <IntlProvider locale={locale} messages={messages}>
            <ConfigContextProvider config={config}>
                <CommerceApp>
                    <Portal selector={mountingPoints.bundleProductOptionsContainer}>
                        <BundleProductOptions />
                    </Portal>
                </CommerceApp>
            </ConfigContextProvider>
        </IntlProvider>
    );
};

window.onload = async () => {
    const { locale, messages } = await loadLocaleData();
    const root = document.createElement('div');
    document.body.appendChild(root);
    ReactDOM.render(
        <Router>
            <App locale={locale} messages={messages} />
        </Router>,
        root
    );
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import thunk from 'redux-thunk';
import reducers from './modules/root/root_reducers';
import Router from './modules/root/root_router';
import logger from './helpers/logger';
import en from '../assets/locales/en.json';

console.log('ENVIRONMENT VARS %s %s %s %s %s', TARGET, PLATFORM, VERSION, REST_API, LANGUAJE);
const store = createStore(reducers, applyMiddleware(thunk, logger));
addLocaleData([...en]);

ReactDOM.render(
  <Provider store={ store }>
    <IntlProvider locale={ LANGUAJE }>
      <Router />
    </IntlProvider>
  </Provider>,
  document.getElementById('app-container')
);

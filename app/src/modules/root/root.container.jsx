import React from 'react';
import Provider from 'react-redux';
import Router from 'react-router';
import DevTools from './devtools';
import routes from './root.routes';

const Root = () => (
  <Provider store={ this.props.store }>
    <div>
      <Router history={ this.props.history } routes={ routes } />
      <DevTools />
    </div>
  </Provider>
);

export default Root;

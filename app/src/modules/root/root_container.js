import React from 'react';
import Provider from 'react-redux';
import Router from 'react-router';
import routes from './root.routes';

const Root = () => (
  <Provider store={ this.props.store }>
    <div>
      <Router history={ this.props.history } routes={ routes } />
    </div>
  </Provider>
);

export default Root;

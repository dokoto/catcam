import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import DevTools from './devtools';
import routes from './root.routes';

export default class Root extends React.Component {
  render() {
    //const { store, history } = this.props;
    return (
      <Provider store={this.props.store}>
        <div>
          <Router history={this.props.history} routes={routes} />
          <DevTools />
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.shape.isRequired,
  history: PropTypes.shape.isRequired,
};

import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import App from './root_component_app';

const publicPath = '/';

export default class Routes extends Component {
  render() {
    return (
      <HashRouter>
        <Route path={ publicPath } component={ App } />
      </HashRouter>
    );
  }
}

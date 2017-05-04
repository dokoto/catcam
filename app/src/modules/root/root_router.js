import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './root_container';

const publicPath = '/';

export default class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path={ publicPath } component={ App } />
      </BrowserRouter>
    );
  }
}

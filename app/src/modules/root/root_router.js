import React, { Component } from 'react';
import { Router, Route } from 'react-router';
import { browserHistory } from 'react-router-redux';
import App from './components/root_component_app';
import About from './components/root_component_about';

const publicPath = '/';

export const routeCodes = {
  ABOUT: `${ publicPath }about`,
};

export default class Routes extends Component {
  render() {
    return (
      <Router history={ browserHistory }>
        <Route path={ publicPath } component={ App }>
          <Route path={ routeCodes.ABOUT } component={ About } />
        </Route>
      </Router>
    );
  }
}

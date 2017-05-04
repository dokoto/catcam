import React, { Component } from 'react';
import { connect } from 'react-redux';

import Root from './root_component_app';

class RootContainer extends Component {
  render() {
    return (
      <Root />
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(RootContainer);

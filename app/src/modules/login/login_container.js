import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { doLogin } from './login_actions';
import Login from './login_component';

class LoginContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e) {
    e.preventDefault();
    this.props.dispatch(doLogin());
  }

  render() {
    return (
      <Login
        rute='/login'
        isAuthenticated={ this.props.isAuthenticated }
        onClick={ this.handleOnClick }
      />
    );
  }
}

function mapStateToProps(state) {
  const { isAuthenticated } = state.auth;
  return {
    isAuthenticated,
  };
}

export default connect(mapStateToProps)(LoginContainer);

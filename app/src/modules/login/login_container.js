import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as style from './login_styles.scss';

import { doLogin } from './login_actions';
import Login from './login_component';

class LoginContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
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
      <div id='login-container' className={ style.container }>
        <Login
          rute='/login'
          isAuthenticated={ this.props.isAuthenticated }
          isFetching={ this.props.isFetching }
          onClick={ this.handleOnClick }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isAuthenticated, isFetching } = state.auth;
  return {
    isAuthenticated,
    isFetching,
  };
}

export default connect(mapStateToProps)(LoginContainer);

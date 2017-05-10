import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './login_styles.scss';

import { doLogin, initLogin } from './login_actions';
import Login from './login_component';

class LoginContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: '',
  };

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e) {
    e.preventDefault();
    if (this.props.error) {
      this.props.dispatch(initLogin());
    } else {
      this.props.dispatch(doLogin());
    }
  }

  render() {
    return (
      <div className='container-login'>
        <Login
          rute='/login'
          isAuthenticated={ this.props.isAuthenticated }
          isFetching={ this.props.isFetching }
          onClick={ this.handleOnClick }
          error={ this.props.error }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isAuthenticated, isFetching, error } = state.auth;
  return {
    isAuthenticated,
    isFetching,
    error,
  };
}

export default connect(mapStateToProps)(LoginContainer);

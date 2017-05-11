import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './login_styles.scss';

import { doLogin, initLogin } from './login_actions';
import Login from './login_component';
import Sandbox from '../../components/sandbox';

class LoginContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.object,
    redirectPath: PropTypes.string,
  };

  static defaultProps = {
    error: null,
    redirectPath: '',
  };

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnBeforeUnLoadIFrame = this.handleOnBeforeUnLoadIFrame.bind(this);
  }

  handleOnClick(e) {
    e.preventDefault();
    if (this.props.error) {
      this.props.dispatch(initLogin());
    } else {
      this.props.dispatch(doLogin());
    }
  }

  handleOnBeforeUnLoadIFrame(e) {
    // this.props.dispatch();
    console.log(`>>>>> ${ e }`);
    const iframeDOM = document.getElementsByClassName('sandbox-container')[0];
    iframeDOM.addEventListener('DOMContentLoaded', () => {
      console.log('PUTO DIEGO');
    });
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
        <Sandbox
          src={ this.props.redirectPath ? `${ REST_API }${ this.props.redirectPath }` : '' }
          show={ !!this.props.redirectPath }
          onbeforeunload={ this.handleOnBeforeUnLoadIFrame }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isAuthenticated, isFetching, error, redirectPath } = state.auth;
  return { isAuthenticated, isFetching, error, redirectPath };
}

export default connect(mapStateToProps)(LoginContainer);

import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Login extends Component {
  render() {
    const { rute, onClick, isAuthenticated } = this.props;

    return (
      <a href={ rute } data-isAuthenticated={ isAuthenticated } onClick={ e => onClick(e) }>
        Login with Google account
      </a>
    );
  }
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  rute: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

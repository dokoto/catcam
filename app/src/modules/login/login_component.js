import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class Login extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    rute: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.object,
  };

  static defaultProps = {
    error: null,
  };

  render() {
    const { rute, onClick, isAuthenticated, isFetching, error } = this.props;

    if (!isFetching) {
      return (
        <a
          href={ rute }
          data-isAuthenticated={ isAuthenticated }
          onClick={ e => onClick(e) }
          className={ !isFetching && !error ? 'login-link' : 'login-link shake' }
        >
          {!isFetching && !error ? <FormattedMessage id='login.auth.message' /> : <FormattedMessage id='login.auth.error' />}
        </a>
      );
    }
    return <span className='login-link'><FormattedMessage id='login.auth.fetching' /></span>;
  }
}

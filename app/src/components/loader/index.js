import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './styles.scss';

export default class Loader extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  render() {
    const { visible, message } = this.props;
    return (
      <div className={ visible ? 'loader-container' : 'loader-container hide' }>
        <div className='loader' />
        <p className='text'>{message}</p>
      </div>
    );
  }
}

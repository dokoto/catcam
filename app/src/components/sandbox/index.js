import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import './styles.scss';

export default class Login extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onbeforeunload: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
    show: false,
  };

  componentDidMount() {
    window.addEventListener('message', this.iframeOnBeforeUnLoad.bind(this), false);
  }

  iframeOnBeforeUnLoad(e) {
    if (e.data.type && e.data.type === 'CATCAM_AUTH') {
      this.props.onbeforeunload(e);
    }
  }

  render() {
    const { src, show } = this.props;
    return (
      <iframe
        src={ src }
        frameBorder='0'
        scrolling='no'
        marginHeight='0'
        marginWidth='0'
        className={ show ? 'sandbox-container show' : 'sandbox-container hide' }
      >
        <p><FormattedMessage id='sandbox.iframe.nosupported' /></p>
      </iframe>
    );
  }
}

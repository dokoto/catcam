import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';

export default class Video extends Component {
  static propTypes = {
    mediaSourceOpen: PropTypes.func.isRequired,
    mediaSourceEnd: PropTypes.func,
    mediaSourceClose: PropTypes.func,
    mediaSourceBufferError: PropTypes.func,
    mimeCodec: PropTypes.string.isRequired,
    bufferMode: PropTypes.string.isRequired,
  };

  static defaultProps = {
    mediaSourceEnd: null,
    mediaSourceClose: null,
    mediaSourceBufferError: null,
  };

  constructor() {
    super();
    this.video = null;
    this.mediaSource = null;
    this.mediaSourceBuffer = null;
    this.queue = [];
  }

  componentDidMount() {
    this.video = document.getElementById('camera');
  }

  mediaSourceOpen() {
    this.mediaSourceBuffer = this.mediaSource.addSourceBuffer(this.props.mimeCodec);
    this.mediaSourceBuffer.mode = this.props.bufferMode;
    this.mediaSourceBuffer.addEventListener('update', this.mediaSourceBufferUpdate.bind(this));
    this.mediaSourceBuffer.addEventListener('updateend', this.mediaSourceBufferUpdate.bind(this));
    this.mediaSourceBuffer.addEventListener('error', this.mediaSourceBufferError.bind(this));

    this.props.mediaSourceOpen();
  }

  mediaSourceEnd() {
    if (this.props.mediaSourceEnd) this.props.mediaSourceEnd();
  }

  mediaSourceClose() {
    if (this.props.mediaSourceClose) this.props.mediaSourceClose();
  }

  mediaSourceBufferUpdate() {
    if (this.queue.length > 0 && !this.mediaSourceBuffer.updating) {
      this.srcBuffer.appendBuffer(this.queue.shift());
    }
  }

  mediaSourceBufferError() {
    this.props.mediaSourceBufferError();
  }

  render() {
    return <video id='camera' width='100%' autoPlay />;
  }
}

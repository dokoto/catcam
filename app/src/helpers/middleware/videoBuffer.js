import React from 'react';
import { FormattedMessage } from 'react-intl';

export const VIDEO_BUFFER_CONNECT = 'VIDEO_BUFFER_CONNECT';
export const VIDEO_BUFFER_CONNECTED = 'VIDEO_BUFFER_CONNECTED';

export const VIDEO_BUFFER_DISCONNET = 'VIDEO_BUFFER_DISCONNET';
export const VIDEO_BUFFER_DISCONNECTED = 'VIDEO_BUFFER_DISCONNECTED';

export const VIDEO_BUFFER_ERROR = 'VIDEO_BUFFER_ERROR';

const MIME_CODEC = 'video/webm; codecs="vp8"';
const BUFFER_MODE = 'sequence';

let video = null;
let mediaSource = null;
let mediaSourceBuffer = null;
const queue = [];

export function requestVideoBufferConnection() {
  return {
    type: VIDEO_BUFFER_CONNECT,
  };
}

export function requestVideoBufferDisConnection() {
  return {
    type: VIDEO_BUFFER_DISCONNET,
  };
}

export function requestVideoBufferConnected() {
  return {
    type: VIDEO_BUFFER_CONNECTED,
  };
}

export function requestVideoBufferDisConnected() {
  return {
    type: VIDEO_BUFFER_DISCONNECTED,
  };
}

export function videoBufferError() {
  return {
    type: VIDEO_BUFFER_ERROR,
  };
}

function mediaSourceEnd() {}

function mediaSourceClose() {}

function mediaSourceEnd() {}

function mediaSourceClose() {}

function mediaSourceBufferError() {}

function mediaSourceBufferUpdate() {
  if (queue.length > 0 && !mediaSourceBuffer.updating) {
    mediaSourceBuffer.appendBuffer(queue.shift());
  }
}

function mediaSourceOpen() {
  mediaSourceBuffer = mediaSource.addSourceBuffer(MIME_CODEC);
  mediaSourceBuffer.mode = BUFFER_MODE;
  mediaSourceBuffer.addEventListener('update', mediaSourceBufferUpdate.bind(this));
  mediaSourceBuffer.addEventListener('updateend', mediaSourceBufferUpdate.bind(this));
  mediaSourceBuffer.addEventListener('error', mediaSourceBufferError.bind(this));
}


export default store => next => action => {
  try {
    switch (action.type) {
      case VIDEO_BUFFER_CONNECT:
        video = action.el;
        mediaSource = new MediaSource();
        video.src = window.URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('sourceopen', mediaSourceOpen.bind(this), false);
        mediaSource.addEventListener('sourceend', mediaSourceEnd.bind(this), false);
        mediaSource.addEventListener('sourceclose', mediaSourceClose.bind(this), false);
        break;
      case VIDEO_BUFFER_DISCONNECTED:
        break;
      default:
        return next(action);
    }
  } catch (err) {
    store.dispatch(videoBufferError(<FormattedMessage id='socket.auth.error' />));
  }
  return next(action);
};

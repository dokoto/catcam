import React from 'react';
import { FormattedMessage } from 'react-intl';
import { requestSocketConnection } from './sockets';

export const VIDEO_BUFFER_CONNECT = 'VIDEO_BUFFER_CONNECT';
export const VIDEO_BUFFER_CONNECTED = 'VIDEO_BUFFER_CONNECTED';

export const VIDEO_BUFFER_DISCONNET = 'VIDEO_BUFFER_DISCONNET';
export const VIDEO_BUFFER_DISCONNECTED = 'VIDEO_BUFFER_DISCONNECTED';

export const VIDEO_BUFFER_ADD_CHUNK = 'VIDEO_BUFFER_ADD_CHUNK';

export const VIDEO_BUFFER_ERROR = 'VIDEO_BUFFER_ERROR';

const MIME_CODEC = 'video/webm; codecs="vp8"';
const BUFFER_MODE = 'sequence';

let video = null;
let mediaSource = null;
let mediaSourceBuffer = null;
const queue = [];

export function requestVideoBufferConnection(tagName) {
  return {
    type: VIDEO_BUFFER_CONNECT,
    tagName,
  };
}

export function requestVideoBufferDisConnection() {
  return {
    type: VIDEO_BUFFER_DISCONNET,
  };
}

export function videoBufferConnected(tagName) {
  return {
    type: VIDEO_BUFFER_CONNECTED,
    tagName,
  };
}

export function videoBufferDisConnected() {
  return {
    type: VIDEO_BUFFER_DISCONNECTED,
  };
}

export function videoBufferAddChunk(chunk) {
  return {
    type: VIDEO_BUFFER_ADD_CHUNK,
    chunk,
  };
}

export function videoBufferError(error) {
  return {
    type: VIDEO_BUFFER_ERROR,
    error,
  };
}

function mediaSourceBufferError(store, error) {
  store.dispatch(videoBufferError(error));
}

function mediaSourceBufferUpdate() {
  if (queue.length > 0 && !mediaSourceBuffer.updating) {
    mediaSourceBuffer.appendBuffer(queue.shift());
  }
}

function mediaSourceOpen(store, tagName) {
  mediaSourceBuffer = mediaSource.addSourceBuffer(MIME_CODEC);
  mediaSourceBuffer.mode = BUFFER_MODE;
  mediaSourceBuffer.addEventListener('update', mediaSourceBufferUpdate.bind(this));
  mediaSourceBuffer.addEventListener('updateend', mediaSourceBufferUpdate.bind(this));
  mediaSourceBuffer.addEventListener('error', mediaSourceBufferError.bind(this));
  store.dispatch(videoBufferConnected(tagName));
  store.dispatch(requestSocketConnection(REST_API));
}

export default store => next => action => {
  try {
    switch (action.type) {
      case VIDEO_BUFFER_CONNECT:
        if ('MediaSource' in window && MediaSource.isTypeSupported(MIME_CODEC)) {
          video = document.getElementById(action.tagName);
          mediaSource = new MediaSource();
          video.src = window.URL.createObjectURL(mediaSource);
          mediaSource.addEventListener('sourceopen', mediaSourceOpen.bind(this, store, action.tagName), false);
        } else {
          store.dispatch(videoBufferError(<FormattedMessage id='videobuffer.connection.error' />));
        }
        break;
      case VIDEO_BUFFER_DISCONNECTED:
        break;
      case VIDEO_BUFFER_ADD_CHUNK:
        if (mediaSourceBuffer.updating || queue.length > 0) {
          queue.push(new Uint8Array(action.chunk));
        } else {
          mediaSourceBuffer.appendBuffer(new Uint8Array(action.chunk));
        }
        break;
      default:
        return next(action);
    }
  } catch (err) {
    store.dispatch(videoBufferError(<FormattedMessage id='videobuffer.connection.error' />));
  }
  return next(action);
};

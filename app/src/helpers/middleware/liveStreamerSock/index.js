import React from 'react';
import io from 'socket.io-client';
import { FormattedMessage } from 'react-intl';
import * as actions from './actions';
import * as actionsCreators from './actionsCreators';

const MIME_CODEC = 'video/webm; codecs="vp8"';
const BUFFER_MODE = 'sequence';

let video = null;
let mediaSource = null;
let mediaSourceBuffer = null;
let ws = null;
let queue = [];

function mediaSourceBufferError(store, error) {
  store.dispatch(actionsCreators.videoBufferError(error));
}

function mediaSourceBufferUpdate() {
  if (queue.length > 0 && !mediaSourceBuffer.updating) {
    mediaSourceBuffer.appendBuffer(queue.shift());
  }
}

function mediaSourceOpen(store, tagName) {
  const state = store.getState();
  mediaSourceBuffer = mediaSource.addSourceBuffer(MIME_CODEC);
  mediaSourceBuffer.mode = BUFFER_MODE;
  mediaSourceBuffer.addEventListener('update', mediaSourceBufferUpdate.bind(this));
  mediaSourceBuffer.addEventListener('updateend', mediaSourceBufferUpdate.bind(this));
  mediaSourceBuffer.addEventListener('error', mediaSourceBufferError.bind(this, store));
  store.dispatch(actionsCreators.videoBufferConnected(tagName));
  store.dispatch(actionsCreators.requestSocketConnection(state.stream.ws));
}

function onConnected(store) {
  const state = store.getState();
  store.dispatch(actionsCreators.socketConnected());
  store.dispatch(actionsCreators.requestSocketJoin(state.stream.channel));
}

function onDisconnected(store) {
  const state = store.getState();
  if (state.stream.playing) {
    store.dispatch(actionsCreators.requestVideoBufferConnection(state.stream.tagName));
  }
}

function onReconnected(store) {
  const state = store.getState();
  if (state.stream.playing) {
    store.dispatch(actionsCreators.requestVideoBufferReConnection());
  }
}

function onChunk(store, chunk) {
  if (mediaSourceBuffer.updating || queue.length > 0) {
    queue.push(new Uint8Array(chunk));
  } else {
    mediaSourceBuffer.appendBuffer(new Uint8Array(chunk));
  }
}

function onJoined(store) {
  const state = store.getState();
  store.dispatch(actionsCreators.socketConnected());
  store.dispatch(
    actionsCreators.requestSocketStartStream(state.stream.channel, state.stream.resolution)
  );
}

function onStarted(store) {
  store.dispatch(actionsCreators.requestSocketStreamStarted());
}

function onRestart(store) {
  store.dispatch(actionsCreators.requestSocketStreamStarted());
}

function clean() {
  video = null;
  if (mediaSource) {
    mediaSource.removeEventListener('sourceopen', mediaSourceOpen, false);
  }
  mediaSource = null;
  mediaSourceBuffer = null;
  if (ws) {
    ws.removeAllListeners('connect');
    ws.removeAllListeners('onChunk');
    ws.removeAllListeners('joined');
    ws.removeAllListeners('restarted');
  }
  ws = null;
  queue = [];
}

export default store => next => action => {
  try {
    switch (action.type) {
      case actions.VIDEO_BUFFER_CONNECT:
        clean();
        if ('MediaSource' in window && MediaSource.isTypeSupported(MIME_CODEC)) {
          video = document.getElementById(action.tagName);
          mediaSource = new MediaSource();
          video.src = window.URL.createObjectURL(mediaSource);
          mediaSource.addEventListener(
            'sourceopen',
            mediaSourceOpen.bind(this, store, action.tagName),
            false
          );
        } else {
          store.dispatch(
            actionsCreators.videoBufferError(<FormattedMessage id='livestreamerscok.video.error' />)
          );
        }
        break;
      case actions.SOCKET_CONNECT:
        ws = io.connect(action.ws);
        ws.on('connect', onConnected.bind(this, store, action.ws));
        ws.on('disconnect', onDisconnected.bind(this, store, action.ws));
        ws.on('reconnecting', onReconnected.bind(this, store, action.ws));
        ws.on('onChunk', onChunk.bind(this, store));
        ws.on('joined', onJoined.bind(this, store));
        ws.on('started', onStarted.bind(this, store));
        ws.on('restarted', onRestart.bind(this, store));
        break;
      case actions.SOCKET_DISCONNECT:
        if (ws) ws.close();
        store.dispatch(actionsCreators.socketDisconnected());
        break;
      case actions.SOCKET_JOIN:
        ws.emit('join', action.channel);
        break;
      case actions.SOCKET_START_STREAM:
        ws.emit('start', { channel: action.channel, resolution: action.resolution });
        break;
      case actions.VIDEO_BUFFER_DISCONNECTED:
        break;
      default:
        return next(action);
    }
  } catch (err) {
    store.dispatch(
      actionsCreators.videoBufferError(<FormattedMessage id='livestreamerscok.error' />)
    );
  }
  return next(action);
};

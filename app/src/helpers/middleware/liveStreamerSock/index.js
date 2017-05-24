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
  store.dispatch(
    actionsCreators.requestSocketStartStream(
      state.stream.email,
      state.stream.channel,
      state.stream.resolution
    )
  );
}

function cleanMedia() {
  video = null;
  if (mediaSource) {
    mediaSource.removeSourceBuffer();
    mediaSource.removeEventListener('sourceopen', mediaSourceOpen, false);
  }
  mediaSourceBuffer = null;
  mediaSource = null;
  queue = [];
}

function cleanWebSocket() {
  if (ws) {
    ws.removeAllListeners('connect');
    ws.removeAllListeners('disconnected');
    ws.removeAllListeners('reconnecting');
    ws.removeAllListeners('onChunk');
    ws.removeAllListeners('joined');
    ws.removeAllListeners('started');
    ws.removeAllListeners('restarted');
  }
  ws = null;
}

function onConnected(store) {
  const state = store.getState();
  store.dispatch(actionsCreators.socketConnected());
  store.dispatch(actionsCreators.requestSocketJoin(state.stream.email, state.stream.channel));
}

function onDisconnected(store) {
  const state = store.getState();
  cleanWebSocket();
  if (state.stream.playing) {
    store.dispatch(actionsCreators.initLiveStreaming(state.stream.tagName, state.stream.ws));
  }
}

function onNewUser(store) {
  const state = store.getState();
  if (state.stream.playing) {
    store.dispatch(actionsCreators.initLiveStreaming(state.stream.tagName, state.stream.ws));
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
  store.dispatch(actionsCreators.socketConnected());
}

function onCameraDown(store) {
  const state = store.getState();
  store.dispatch(actionsCreators.requestVideoBufferConnection(state.stream.tagName));
}

function onStarted(store) {
  store.dispatch(actionsCreators.requestSocketStreamStarted());
}

function onRestart(store) {
  store.dispatch(actionsCreators.requestSocketStreamStarted());
}

export default store => next => action => {
  try {
    switch (action.type) {
      case actions.INIT_LIVE_STREAMING:
        cleanMedia();
        if (!ws) {
          store.dispatch(actionsCreators.requestSocketConnection(action.ws));
        }
        break;
      case actions.VIDEO_BUFFER_CONNECT:
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
        ws.on('disconnected', onDisconnected.bind(this, store, action.ws));
        ws.on('new:user', onNewUser.bind(this, store, action.ws));
        ws.on('onChunk', onChunk.bind(this, store));
        ws.on('joined', onJoined.bind(this, store));
        ws.on('started', onStarted.bind(this, store));
        ws.on('restarted', onRestart.bind(this, store));
        ws.on('camera:down', onCameraDown.bind(this, store));
        break;
      case actions.SOCKET_DISCONNECT:
        if (ws) ws.close();
        store.dispatch(actionsCreators.socketDisconnected());
        break;
      case actions.SOCKET_JOIN:
        ws.emit('join', { email: action.email, channel: action.channel });
        break;
      case actions.SOCKET_START_STREAM:
        ws.emit('start', {
          email: action.email,
          channel: action.channel,
          resolution: action.resolution,
        });
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

// FUSILADO DE : https://exec64.co.uk/blog/websockets_with_redux/

import io from 'socket.io-client';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const SOCKET_CONNECT = 'SOCKET_CONNECT';
export const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT';
export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';
export const SOCKET_ONCHUNK = 'SOCKET_ONCHUNK';
export const SOCKET_JOIN = 'SOCKET_JOIN';
export const SOCKET_JOINED = 'SOCKET_JOINED';
export const SOCKET_START_STREAM = 'SOCKET_START_STREAM';
export const SOCKET_STREAM_STARTED = 'SOCKET_STREAM_STARTED';
export const SOCKET_ERROR = 'SOCKET_ERROR';
let ws = null;

export function requestConnection(url) {
  return {
    type: SOCKET_CONNECT,
    url,
  };
}

export function requestDisconection() {
  return {
    type: SOCKET_DISCONNECT,
  };
}

export function requestJoin(channel) {
  return {
    type: SOCKET_JOIN,
    channel,
  };
}

export function requestStartStream(channel) {
  return {
    type: SOCKET_START_STREAM,
    channel,
  };
}

export function requestStreamStarted() {
  return {
    type: SOCKET_STREAM_STARTED,
  };
}

export function connected() {
  return {
    type: SOCKET_CONNECTED,
  };
}

export function disconnected() {
  return {
    type: SOCKET_DISCONNECTED,
  };
}

export function joined() {
  return {
    type: SOCKET_JOINED,
  };
}

export function bufferRecieved(buffer) {
  return {
    type: SOCKET_ONCHUNK,
    buffer,
  };
}

export function socketError(error) {
  return {
    type: SOCKET_ERROR,
    error,
  };
}

function onConnected(store) {
  store.dispatch(connected());
}

function onChunk(store, buffer) {
  store.dispatch(bufferRecieved(buffer));
}

export default store => next => action => {
  try {
    switch (action.type) {
      case SOCKET_CONNECT:
        ws = io.connect(action.url);
        ws.on('connect', onConnected.bind(this, store));
        ws.on('onChunk', onChunk.bind(this, store));
        break;
      case SOCKET_DISCONNECT:
        if (ws) ws.close();
        store.dispatch(disconnected());
        break;
      case SOCKET_JOIN:
        ws.emit('join', action.channel);
        store.dispatch(joined());
        break;
      case SOCKET_START_STREAM:
        ws.emit('start', action.channel);
        store.dispatch(requestStreamStarted());
        break;
      default:
        return next(action);
    }
  } catch (err) {
    store.dispatch(socketError(<FormattedMessage id='socket.auth.error' />));
  }
  return next(action);
};

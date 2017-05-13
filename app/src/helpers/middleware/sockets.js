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

export function requestSocketConnection(sockUrl) {
  return {
    type: SOCKET_CONNECT,
    sockUrl,
  };
}

export function requestSocketDisconection() {
  return {
    type: SOCKET_DISCONNECT,
  };
}

export function requestSocketJoin(channel) {
  return {
    type: SOCKET_JOIN,
    channel,
  };
}

export function requestSocketStartStream(channel) {
  return {
    type: SOCKET_START_STREAM,
    channel,
  };
}

export function requestSocketStreamStarted() {
  return {
    type: SOCKET_STREAM_STARTED,
  };
}

export function socketConnected(socketUrl) {
  return {
    type: SOCKET_CONNECTED,
    socketUrl,
  };
}

export function socketDisconnected() {
  return {
    type: SOCKET_DISCONNECTED,
  };
}

export function socketJoined() {
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

function onConnected(store, socketUrl) {
  const state = store.getState();
  store.dispatch(socketConnected(socketUrl));
  store.dispatch(requestSocketStartStream(state.stream.channel));
}

function onChunk(store, buffer) {
  store.dispatch(bufferRecieved(buffer));
}

export default store => next => action => {
  try {
    switch (action.type) {
      case SOCKET_CONNECT:
        ws = io.connect(action.socketUrl);
        ws.on('connect', onConnected.bind(this, store, action.socketUrl));
        ws.on('onChunk', onChunk.bind(this, store));
        break;
      case SOCKET_DISCONNECT:
        if (ws) ws.close();
        store.dispatch(socketDisconnected());
        break;
      case SOCKET_JOIN:
        ws.emit('join', action.channel);
        store.dispatch(socketJoined());
        break;
      case SOCKET_START_STREAM:
        ws.emit('start', action.channel);
        store.dispatch(requestSocketStreamStarted());
        break;
      default:
        return next(action);
    }
  } catch (err) {
    store.dispatch(socketError(<FormattedMessage id='socket.auth.error' />));
  }
  return next(action);
};

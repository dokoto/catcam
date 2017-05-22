import * as actions from './actions';

export function requestVideoBufferConnection(tagName) {
  return {
    type: actions.VIDEO_BUFFER_CONNECT,
    tagName,
  };
}

export function requestVideoBufferDisConnection() {
  return {
    type: actions.VIDEO_BUFFER_DISCONNET,
  };
}

export function requestSocketConnection(sockUrl) {
  return {
    type: actions.SOCKET_CONNECT,
    ws: sockUrl,
  };
}

export function requestSocketDisconection() {
  return {
    type: actions.SOCKET_DISCONNECT,
  };
}

export function requestSocketJoin(channel) {
  return {
    type: actions.SOCKET_JOIN,
    channel,
  };
}

export function requestSocketStartStream(channel, resolution) {
  return {
    type: actions.SOCKET_START_STREAM,
    channel,
    resolution,
  };
}

export function videoBufferConnected(tagName) {
  return {
    type: actions.VIDEO_BUFFER_CONNECTED,
    tagName,
  };
}

export function videoBufferDisConnected() {
  return {
    type: actions.VIDEO_BUFFER_DISCONNECTED,
  };
}

export function videoBufferAddChunk(chunk) {
  return {
    type: actions.VIDEO_BUFFER_ADD_CHUNK,
    chunk,
  };
}

export function videoBufferError(error) {
  return {
    type: actions.VIDEO_BUFFER_ERROR,
    error,
  };
}

export function socketConnected() {
  return {
    type: actions.SOCKET_CONNECTED,
  };
}

export function socketDisconnected() {
  return {
    type: actions.SOCKET_DISCONNECTED,
  };
}

export function socketJoined() {
  return {
    type: actions.SOCKET_JOINED,
  };
}

export function socketError(error) {
  return {
    type: actions.SOCKET_ERROR,
    error,
  };
}

export function requestSocketStreamStarted() {
  return {
    type: actions.SOCKET_STREAM_STARTED,
  };
}

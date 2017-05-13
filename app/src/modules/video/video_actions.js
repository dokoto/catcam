import { requestVideoBufferConnection } from '../../helpers/middleware/videoBuffer';

export const VIDEO_INIT = 'VIDEO_INIT';
export const VIDEO_CHANNEL_RECIEVED = 'VIDEO_CHANNEL_RECIEVED';
export const VIDEO_ERROR = 'VIDEO_ERROR';
export const VIDEO_START_STREAM = 'VIDEO_START_STREAM';

export function videoChannelRecieved(channel) {
  return {
    type: VIDEO_CHANNEL_RECIEVED,
    channel,
  };
}

export function videoError(error) {
  return {
    type: VIDEO_ERROR,
    error,
  };
}

export function requestStartStream() {
  return {
    type: VIDEO_START_STREAM,
  };
}

export function initVideo(tagName) {
  return dispatch => {
    return fetch(`${ REST_API }/stream`)
      .then(response => response.json())
      .then(json => {
        dispatch(videoChannelRecieved(json.channel));
        dispatch(requestVideoBufferConnection(tagName));
      })
      .catch(err => {
        dispatch(videoError(err));
      });
  };
}

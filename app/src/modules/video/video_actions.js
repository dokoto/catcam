import { requestVideoBufferConnection } from '../../helpers/middleware/liveStreamerSock/actionsCreators';

export const VIDEO_INIT = 'VIDEO_INIT';
export const VIDEO_INFO_RECIEVED = 'VIDEO_CHANNEL_RECIEVED';
export const VIDEO_ERROR = 'VIDEO_ERROR';
export const VIDEO_START_STREAM = 'VIDEO_START_STREAM';

export function videoInfoRecieved(channel, ws) {
  return {
    type: VIDEO_INFO_RECIEVED,
    channel,
    ws,
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
    return fetch(`${ REST_API }/info`)
      .then(response => response.json())
      .then(json => {
        dispatch(videoInfoRecieved(json.channel, json.ws, json.id));
        dispatch(requestVideoBufferConnection(tagName));
      })
      .catch(err => {
        dispatch(videoError(err));
      });
  };
}

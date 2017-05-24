import {
  initLiveStreaming,
} from '../../helpers/middleware/liveStreamerSock/actionsCreators';

export const VIDEO_INIT = 'VIDEO_INIT';
export const VIDEO_INFO_RECIEVED = 'VIDEO_INFO_RECIEVED';
export const VIDEO_ERROR = 'VIDEO_ERROR';
export const VIDEO_START_STREAM = 'VIDEO_START_STREAM';

export function videoInfoRecieved(email, channel, ws, id, resolutions, quality) {
  return {
    type: VIDEO_INFO_RECIEVED,
    email,
    channel,
    ws,
    id,
    resolutions,
    quality,
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
        const ratio = screen.orientation.type.indexOf('portrait') !== -1
          ? (screen.height / screen.width).toFixed(1)
          : (screen.width / screen.height).toFixed(1);
        const validResolitions = json.resolutions
          .map(item => {
            const [w, h] = item.split('x');
            return ratio === (w / h).toFixed(1) ? item : '0x0';
          })
          .filter(item => item !== '0x0');
        dispatch(
          videoInfoRecieved(json.user.email, json.channel, json.ws, json.id, validResolitions, {
            max: validResolitions.length,
            current: Math.round(validResolitions.length / 2),
          })
        );
        dispatch(initLiveStreaming(tagName, json.ws));
      })
      .catch(err => {
        dispatch(videoError(err));
      });
  };
}

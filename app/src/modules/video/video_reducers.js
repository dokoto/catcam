import * as actions from './video_actions';
import { VIDEO_BUFFER_CONNECTED, VIDEO_BUFFER_ERROR } from '../../helpers/middleware/videoBuffer';
import { SOCKET_STREAM_STARTED, SOCKET_CONNECTED } from '../../helpers/middleware/sockets';

const defaultState = {
  playing: false,
  socketStarted: false,
  socketConnected: false,
  bufferLoaded: false,
  ws: '',
  tagName: '',
  channel: '',
  type: 'webcam',
  sources: {
    cam1: {
      id: '/dev/video0',
      resolutions: ['640x480', '800x600'],
      type: '',
    },
  },
  id: '/dev/video0',
  resolution: '640x480',
  orientation: 'landscape',
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case actions.VIDEO_INIT:
      return {
        ...defaultState,
      };

    case VIDEO_BUFFER_CONNECTED:
      return {
        ...state,
        bufferLoaded: true,
        tagName: action.tagName,
      };

    case SOCKET_CONNECTED:
      return {
        ...state,
        socketUrl: action.ws,
        socketConnected: true,
      };

    case actions.VIDEO_CHANNEL_RECIEVED:
      return {
        ...state,
        channel: action.channel,
      };

    case SOCKET_STREAM_STARTED:
      return {
        ...state,
        socketStarted: true,
      };

    case VIDEO_BUFFER_ERROR || actions.VIDEO_ERROR:
      return {
        ...state,
        playing: false,
        error: action.error,
      };

    default:
      return state;
  }
};

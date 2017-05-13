import * as actions from './video_actions';
import { VIDEO_BUFFER_CONNECTED } from '../../helpers/middleware/videoBuffer';

const defaultState = {
  playing: false,
  socketStarted: false,
  socketConnected: false,
  bufferLoaded: false,
  socketUrl: '',
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
    case actions.INIT_LOGIN:
      return {
        ...defaultState,
      };

    case VIDEO_BUFFER_CONNECTED:
      return {
        ...state,
        bufferLoaded: true,
        tagName: action.tagName,
      };

    case actions.SOCKET_CONNECTED:
      return {
        ...state,
        socketUrl: action.socketUrl,
        socketConnected: true,
      };

    case actions.SOCKET_STREAM_STARTED:
      return {
        ...state,
        socketStarted: true,
      };

    case actions.VIDEO_BUFFER_ERROR || actions.VIDEO_ERROR:
      return {
        ...state,
        playing: false,
        error: action.error,
      };

    default:
      return state;
  }
};

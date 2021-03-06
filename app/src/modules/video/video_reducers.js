import * as actions from './video_actions';
import {
  INIT_LIVE_STREAMING,
  VIDEO_BUFFER_CONNECT,
  VIDEO_BUFFER_CONNECTED,
  VIDEO_BUFFER_ERROR,
  SOCKET_STREAM_STARTED,
  SOCKET_CONNECTED,
  VIDEO_BUFFER_RECONNECTING,
} from '../../helpers/middleware/liveStreamerSock/actions';

const defaultState = {
  playing: false,
  socketStarted: false,
  socketConnected: false,
  bufferLoaded: false,
  ws: '',
  tagName: '',
  channel: '',
  type: 'webcam',
  id: '/dev/video0',
  email: '',
  resolution: '640x480',
  resolutions: [],
  quality: {
    max: 0,
    current: 0,
  },
  orientation: 'landscape',
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case INIT_LIVE_STREAMING: {
      return {
        ...state,
        playing: false,
        socketStarted: false,
        socketConnected: false,
        bufferLoaded: false,
        tagName: action.tagName,
        ws: action.ws,
      };
    }
    case VIDEO_BUFFER_CONNECT:
      return {
        ...state,
        playing: false,
        bufferLoaded: false,
        tagName: action.tagName,
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
        socketConnected: true,
      };

    case actions.VIDEO_INFO_RECIEVED:
      return {
        ...state,
        email: action.email,
        ws: action.ws,
        channel: action.channel,
        id: action.id,
        resolutions: action.resolutions,
        quality: action.quality,
        resolution: action.resolutions[action.quality.current],
      };

    case SOCKET_STREAM_STARTED:
      return {
        ...state,
        socketStarted: true,
        playing: true,
      };

    case VIDEO_BUFFER_RECONNECTING:
      return {
        ...state,
        playing: false,
        bufferLoaded: false,
        socketStarted: false,
      };

    case VIDEO_BUFFER_ERROR || actions.VIDEO_ERROR:
      return {
        ...state,
        playing: false,
        bufferLoaded: false,
        socketStarted: false,
        error: action.error,
      };

    default:
      return state;
  }
};

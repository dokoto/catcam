import * as actions from './video_actions';
import {
  VIDEO_BUFFER_CONNECTED,
  VIDEO_BUFFER_ERROR,
  SOCKET_STREAM_STARTED,
  SOCKET_CONNECTED,
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
  sources: {
    cam0: {
      id: '/dev/video0',
      resolutions: ['640x480', '800x600'],
      type: 'webcam',
    },
    cam1: {
      id: 'video=Integrated Camera',
      resolutions: ['640x480', '800x600'],
      type: 'webcam',
    },
  },
  id: '/dev/video0',
  resolution: '640:480',
  orientation: 'landscape',
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case actions.VIDEO_INIT:
      return {
        ...defaultState,
        resolution: `${ window.innerWidth }:${ window.innerHeight }`,
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
        ws: action.ws,
        channel: action.channel,
        id: action.id,
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

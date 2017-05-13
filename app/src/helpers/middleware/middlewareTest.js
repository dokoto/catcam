import { videoBufferConnected } from './videoBuffer';

export const ACTION_TEST = 'ACTION_TEST';

export function doTest(tagName) {
  return {
    type: ACTION_TEST,
    tagName,
  };
}

export default store => next => action => {
  try {
    switch (action.type) {
      case ACTION_TEST:
        console.log('dispatching', action);
        console.log('next state', store.getState());
        store.dispatch(videoBufferConnected(action.tagName));
        return next(action);
      default:
        return next(action);
    }
  } catch (err) {
    console.error(err);
  }
  return next(action);
};

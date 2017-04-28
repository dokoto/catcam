import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as rootActions from './root_actions';

const initApp = (state = {}, action) => {
  switch (action.type) {
    case rootActions.INIT_APP:
      return [...state, {
        date: new Date(),
        count: this.state.count + 1,
      }];
    default:
      return [...state, {
        date: new Date(),
        count: 1,
      }];
  }
};

const reducer = combineReducers({
  initApp,
  routing,
});

export default reducer;

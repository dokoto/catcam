import * as actions from './login_actions';

export default (
  state = {
    isFetching: false,
    isAuthenticated: false,
  },
  action
) => {
  switch (action.type) {
    case actions.INIT_LOGIN:
      return {
        isFetching: false,
        isAuthenticated: false,
      };
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    case actions.LOGOUT_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: true,
      };
    case actions.LOGIN_OATUH:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        redirectPath: action.redirectPath,
      };
    case actions.LOGIN_SUCCESS:
      return {
        isFetching: false,
        isAuthenticated: true,
        user: action.user,
      };
    case actions.LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
      };
    case actions.PROCESS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        error: action.error,
      };
    default:
      return state;
  }
};

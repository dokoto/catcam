export const INIT_LOGIN = 'INIT_LOGIN';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGIN_OATUH = 'LOGIN_OATUH';
export const PROCESS_FAILURE = 'PROCESS_FAILURE';

export function initLogin() {
  return {
    type: INIT_LOGIN,
  };
}

export function requestLogin() {
  return {
    type: LOGIN_REQUEST,
  };
}

export function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  };
}


export function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

export function loginOAuth(redirectPath) {
  return {
    type: LOGIN_OATUH,
    redirectPath,
  };
}

export function processError(error) {
  return {
    type: PROCESS_FAILURE,
    error,
  };
}

export function doLogout() {
  return dispatch => {
    dispatch(requestLogout());
    return fetch(`${ REST_API }/logout`)
      .then(response => {
        response.json().then(json => {
          try {
            if (!json.auth) {
              dispatch(receiveLogout());
            } else {
              dispatch(processError('Logout error'));
            }
          } catch (err) {
            dispatch(processError(err));
          }
        });
      })
      .catch(err => {
        dispatch(processError(err));
      });
  };
}

export function doLogin() {
  return dispatch => {
    dispatch(requestLogin());
    return fetch(`${ REST_API }/login`)
      .then(response => {
        response.json().then(json => {
          try {
            if (json.auth) {
              dispatch(receiveLogin(json.user));
            } else {
              dispatch(loginOAuth(json.redirect));
            }
          } catch (err) {
            dispatch(processError(err));
          }
        });
      })
      .catch(err => {
        dispatch(processError(err));
      });
  };
}

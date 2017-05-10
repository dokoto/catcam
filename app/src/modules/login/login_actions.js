export const INIT_LOGIN = 'INIT_LOGIN';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGIN_OAUTH2_REQUEST = 'LOGIN_OAUTH2_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
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

export function requestOauth2() {
  return {
    type: LOGIN_OAUTH2_REQUEST,
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

export function processError(message) {
  return {
    type: PROCESS_FAILURE,
    message,
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
            dispatch(processError(err.message));
          }
        });
      })
      .catch(err => {
        dispatch(processError(err.message));
      });
  };
}

export function doOauth(path) {
  return dispatch => {
    dispatch(requestOauth2());
    return fetch(`${ REST_API }${ path }`)
      .then(response => {
        response.json().then(json => {
          try {
            if (json.auth) {
              dispatch(receiveLogin());
            } else {
              dispatch(processError('Login error'));
            }
          } catch (err) {
            dispatch(processError(err.message));
          }
        });
      })
      .catch(err => {
        dispatch(processError(err.message));
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
              dispatch(doOauth(json.redirect));
            }
          } catch (err) {
            dispatch(processError(err.message));
          }
        });
      })
      .catch(err => {
        dispatch(processError(err.message));
      });
  };
}

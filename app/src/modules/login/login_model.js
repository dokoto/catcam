import fetch from 'isomorphic-fetch';

class Login {
  signin(dispatch, path) {
    fetch(`https://proxyserver.homelinux.net:8001/${ path }`)
      .then(respStr => {
        try {
          const res = JSON.parse(respStr);
          if (!res.auth) {
            dispatch(receiveLogout());
          } else {
            dispatch(processError('Login error'));
          }
        } catch (err) {
          dispatch(processError(err.message));
        }
      })
      .catch(err => {
        dispatch(processError(err.message));
      });
  }
}

export default Login;

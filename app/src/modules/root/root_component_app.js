import React from 'react';
import * as style from './root_styles.scss';
import Login from '../login/login_container';

const App = () => <div id='app' className={ style.container } >
  <Login />
</div>;

export default App;

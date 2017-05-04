import React from 'react';
import { containerClass } from './root_styles.scss';
import Login from '../login/login_container';

const App = () => <div id='app' className={ containerClass } >
  <Login />
</div>;

export default App;

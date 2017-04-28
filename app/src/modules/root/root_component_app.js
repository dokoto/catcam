import React from 'react';
import { containerClass } from './root_styles.scss';
import Login from '../login/components';

const App = () => <div id='app' className={ containerClass } >
  <Login />
</div>;

export default App;

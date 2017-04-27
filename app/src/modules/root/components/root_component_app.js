import React from 'react';
import { Link } from 'react-router-redux';
import { container, footer } from '../root_styles.scss';

const App = () => (
  <div className={ container }>
    <footer className={ footer }>
      <Link to='/about'>About</Link>
    </footer>
  </div>
);

export default App;

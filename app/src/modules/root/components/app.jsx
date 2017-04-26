import React from 'react';
import { Link } from 'react-router';
import { container, footer } from '../styles/root.scss';

const App = () => <div className={container}>
  <footer className={footer}>
    <Link to="/about">About</Link>
  </footer>
</div>;

export default App;

'use strict';

import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {container, footer} from './styles/root.scss';

const App = ({children}) =>
<div className={container}>
    <footer className={footer}>
        <Link to="/about">About</Link>
    </footer>
</div>;

App.propTypes = {
    children: PropTypes.object
};

export default App;

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Provider from 'react-redux';
import Root from './modules/root/root.container';

const render = Component => {
  ReactDOM.render(
    <Provider>
      <Component />
    </Provider>,
    document.getElementById('root')
  );
};

render(Root);

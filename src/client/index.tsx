import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';
import App from './Components/App';
import { store } from './Store/store';

const container = document.getElementById('root')!;

const FullApp = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

hydrateRoot(container, <FullApp />);

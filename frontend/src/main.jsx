// Polyfill Buffer for simple-peer BEFORE any other imports
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
window.Buffer = Buffer;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

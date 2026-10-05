import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/urbanist';
import './styles.css';
import App from './App.jsx';

const Surface = /^\/start\/?$/.test(window.location.pathname)
  ? (await import('./StartPage.jsx')).default
  : App;

createRoot(document.getElementById('root')).render(<React.StrictMode><Surface /></React.StrictMode>);

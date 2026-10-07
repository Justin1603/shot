import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/urbanist';
import './styles.css';

const Surface = /^\/start\/?$/.test(window.location.pathname)
  ? (await import('./StartPage.jsx')).default
  : (await import('./EntryPage.jsx')).default;

createRoot(document.getElementById('root')).render(<React.StrictMode><Surface /></React.StrictMode>);

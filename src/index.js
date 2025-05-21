import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Import the theme CSS directly in your React app
import './styles/schooloflife-theme.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

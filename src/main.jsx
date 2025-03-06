import React from 'react';
import { createRoot } from 'react-dom/client';
<<<<<<< HEAD
=======
import './index.css';
>>>>>>> 31e1d0cea6eb9a3ac71a7ff415edb0b23d221b11
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

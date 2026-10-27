import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // 1. Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // 2. Import the default styles
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      
    </BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} /> {/* 3. Place it here */}
  </StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 
import { AuthProvider } from './context/AuthContext'; // <-- Importe aqui

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O AuthProvider deve ser o mais alto possível */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
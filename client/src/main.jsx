// client/src/main.jsx (ПОВНИЙ КОД, знову перевірте)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { AuthProvider } from './context/AuthContext'; // <-- ПЕРЕМІСТИМО ЦЕЙ ІМПОРТ

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Тут залишається лише App і ToastContainer */}
        <App />
        <ToastContainer />
    </React.StrictMode>,
);
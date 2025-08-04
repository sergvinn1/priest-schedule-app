// client/src/App.jsx (ПОВНИЙ КОД, ВИПРАВЛЕНО)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import PriestsPage from './pages/PriestsPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/routing/PrivateRoute';
import { AuthProvider } from './context/AuthContext'; // <-- ІМПОРТ AuthProvider СЮДИ
import './App.css';

// Заглушка для майбутньої адмін-панелі
const AdminDashboardPage = () => (
    <div className="page-container">
        <h2>Адмін Панель</h2>
        <p>Тут буде функціонал для адміністратора (додавання/редагування/видалення священників та розкладів).</p>
    </div>
);

function App() {
    return (
        <Router>
            <AuthProvider> {/* <-- ОБГОРТАЄМО AuthProvider СЮДИ, ВЖЕ ПІСЛЯ ROUTER */}
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/schedule" element={<SchedulePage />} />
                        <Route path="/priests" element={<PriestsPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute roles={['admin']}>
                                    <AdminDashboardPage />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </MainLayout>
            </AuthProvider>
        </Router>
    );
}

export default App;
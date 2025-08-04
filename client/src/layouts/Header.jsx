// client/src/layouts/Header.jsx (ПОВНИЙ КОД)
import React from 'react';
import { Link } from 'react-router-dom'; // Використовуємо Link замість <a> для React Router
import { useAuth } from '../context/AuthContext'; // Імпортуємо хук аутентифікації
import Button from '../components/buttons/Button'; // Імпортуємо кнопку
import './Header.css';

const Header = () => {
    const { user, loading, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">Розклад Священників</Link>
                <nav className="nav-menu">
                    <Link to="/schedule">Розклад</Link>
                    <Link to="/priests">Священники</Link>

                    {loading ? (
                        <span>Завантаження...</span>
                    ) : user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin">Адмін Панель</Link>
                            )}
                            <span className="user-info">Привіт, {user.username}!</span>
                            <Button onClick={logout} variant="outline" className="logout-button">
                                Вийти
                            </Button>
                        </>
                    ) : (
                        <Link to="/login" className="login-button">Увійти</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
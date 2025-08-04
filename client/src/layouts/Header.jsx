// client/src/components/layout/Header.jsx (ПОВНИЙ КОД)
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaUserShield, FaSignOutAlt, FaHome, FaCalendarAlt, FaUsers, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Імпортуємо контекст автентифікації
import Button from '../components/buttons/Button'; // Імпортуємо компонент кнопки
import ChurchLogo from '../components/common/ChurchLogo'; // Імпортуємо новий компонент логотипу
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo" onClick={closeMenu}>
                    {/* Замість <img src="/logo.svg" ... /> */}
                    <ChurchLogo className="logo-icon" /> {/* Використовуємо новий компонент */}
                    <span className="logo-text">Назва Храму</span>
                </Link>

                <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li>
                            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
                                <FaHome /> Головна
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/schedule" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
                                <FaCalendarAlt /> Розклад
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/priests" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
                                <FaUsers /> Священники
                            </NavLink>
                        </li>
                    
                        {isAuthenticated && user?.role === 'admin' && (
                            <li>
                                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeMenu}>
                                    <FaUserShield /> Адмін Панель
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </nav>

                <div className="header-auth-section">
                    {isAuthenticated ? (
                        <>
                            <span className="user-welcome">Привіт, {user?.username}!</span>
                            <Button onClick={logout} variant="secondary" className="logout-button">
                                <FaSignOutAlt /> Вийти
                            </Button>
                        </>
                    ) : (
                        <Link to="/login" onClick={closeMenu}>
                            <Button variant="primary">Увійти</Button>
                        </Link>
                    )}
                </div>

                <button className="menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>
        </header>
    );
};

export default Header;
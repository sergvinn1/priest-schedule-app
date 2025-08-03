// client/src/layouts/Header.jsx
import React from 'react';
import './Header.css'; // Стилі для хедера

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <a href="/" className="logo">Розклад cвященників</a>
                <nav className="nav-menu">
                    {/* Тут будуть посилання */}
                    <a href="/schedule">Розклад</a>
                    <a href="/priests">Священники</a>
                    <a href="/login" className="login-button">Увійти</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
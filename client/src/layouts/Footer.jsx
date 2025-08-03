// client/src/layouts/Footer.jsx
import React from 'react';
import './Footer.css'; // Стилі для футера

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} Розклад Священників. Всі права захищені.</p>
            </div>
        </footer>
    );
};

export default Footer;
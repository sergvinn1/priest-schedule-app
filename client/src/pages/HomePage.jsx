// client/src/pages/HomePage.jsx
import React from 'react';
import './Page.css'; // Загальні стилі для сторінок

const HomePage = () => {
    return (
        <div className="page-container">
            <h2>Ласкаво просимо!</h2>
            <p>Цей додаток допоможе вам дізнатися розклад чергувань священників.</p>
            <p>Виберіть діапазон дат, щоб переглянути розклад.</p>
        </div>
    );
};

export default HomePage;
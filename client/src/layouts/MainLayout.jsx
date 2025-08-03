// client/src/layouts/MainLayout.jsx
import React from 'react';
import Header from './Header'; // Будемо створювати
import Footer from './Footer'; // Будемо створювати
import './MainLayout.css'; // Стилі для лейауту

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
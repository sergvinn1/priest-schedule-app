// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import PriestsPage from './pages/PriestsPage';
import LoginPage from './pages/LoginPage';
import './App.css'; // Для загальних стилів App div

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/priests" element={<PriestsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    {/* Додамо 404 сторінку пізніше */}
                    {/* <Route path="*" element={<NotFoundPage />} /> */}
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
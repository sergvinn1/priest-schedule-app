// client/src/pages/PriestsPage.jsx (ПОВНИЙ КОД)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PriestCard from '../components/priests/PriestCard';
import './Page.css'; // Загальні стилі для сторінок
import './PriestsPage.css'; // Стилі для PriestsPage

const PriestsPage = () => {
    const [priests, setPriests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    useEffect(() => {
        const fetchPriests = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/priests`);
                if (res.data.success) {
                    setPriests(res.data.data);
                } else {
                    toast.error(res.data.error || 'Невідома помилка при завантаженні священників.');
                    setError(res.data.error || 'Невідома помилка.');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message || 'Помилка завантаження священників.';
                toast.error(errorMessage);
                setError(errorMessage);
                console.error('Fetch priests error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPriests();
    }, [API_URL]);

    if (loading) {
        return (
            <div className="page-container">
                <h2>Наші Священники</h2>
                <p>Завантаження священників...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container error-container">
                <h2>Помилка</h2>
                <p>{error}</p>
                <p>Будь ласка, спробуйте оновити сторінку.</p>
            </div>
        );
    }

    if (priests.length === 0) {
        return (
            <div className="page-container">
                <h2>Наші Священники</h2>
                <p>Немає доступних священників.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h2>Наші Священники</h2>
            <div className="priests-grid">
                {priests.map((priest) => (
                    <PriestCard key={priest._id} priest={priest} />
                ))}
            </div>
        </div>
    );
};

export default PriestsPage;
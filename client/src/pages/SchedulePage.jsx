// client/src/pages/SchedulePage.jsx (ПОВНИЙ КОД)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ScheduleCard from '../components/schedules/ScheduleCard';
import Input from '../components/forms/Input';
import Button from '../components/buttons/Button';
import './Page.css';
import './SchedulePage.css';

const SchedulePage = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            setError(null);

            let query = '';
            if (startDateFilter) {
                query += `startDate[gte]=${startDateFilter}T00:00:00.000Z`;
            }
            if (endDateFilter) {
                query += `${query ? '&' : ''}endDate[lte]=${endDateFilter}T23:59:59.999Z`;
            }

            const url = `${API_URL}/schedules${query ? `?${query}` : ''}`;
            console.log('Fetching schedules from URL:', url);

            const res = await axios.get(url);

            if (res.data.success) {
                setSchedules(res.data.data);
            } else {
                toast.error(res.data.error || 'Невідома помилка при завантаженні розкладів.');
                setError(res.data.error || 'Невідома помилка.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Помилка завантаження розкладів.';
            toast.error(errorMessage);
            setError(errorMessage);
            console.error('Fetch schedules error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchSchedules();
    };

    const handleClearFilters = () => {
        setStartDateFilter('');
        setEndDateFilter('');
        fetchSchedules();
    };


    return (
        <div className="page-container">
            <h2>Розклад Чергувань</h2>

            <form onSubmit={handleFilterSubmit} className="schedule-filter-form">
                <Input
                    label="Від дати"
                    id="startDateFilter"
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                />
                <Input
                    label="До дати"
                    id="endDateFilter"
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                />
                <div className="filter-buttons">
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Пошук...' : 'Фільтрувати'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleClearFilters} disabled={loading}>
                        Очистити фільтри
                    </Button>
                </div>
            </form>

            {loading && (
                <div className="loading-message">Завантаження розкладів...</div>
            )}

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <p>Будь ласка, спробуйте оновити сторінку.</p>
                </div>
            )}

            {!loading && !error && schedules.length === 0 && (
                <div className="no-schedules-message">Немає розкладів, що відповідають вашим критеріям.</div>
            )}

            {/* Рендеримо сітку лише тоді, коли дані завантажені, немає помилок, і є розклади */}
            {!loading && !error && schedules.length > 0 && (
                <div className="schedules-grid">
                    {schedules.map((schedule) => (
                        <ScheduleCard key={schedule._id} schedule={schedule} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SchedulePage;
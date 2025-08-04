import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '../../components/buttons/Button';
import Input from '../../components/forms/Input';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import './AdminSchedulesPage.css';
import './AdminPage.css';

const AdminSchedulesPage = () => {
    const [schedules, setSchedules] = useState([]);
    const [priests, setPriests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddEditForm, setShowAddEditForm] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/schedules`);
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

    const fetchPriests = async () => {
        try {
            const res = await axios.get(`${API_URL}/priests`);
            if (res.data.success) {
                setPriests(res.data.data);
            } else {
                toast.error(res.data.error || 'Невідома помилка при завантаженні священників для форми.');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || err.message || 'Помилка завантаження священників для форми.');
            console.error('Fetch priests for form error:', err);
        }
    };

    useEffect(() => {
        fetchSchedules();
        fetchPriests();
    }, []);

    const handleAddSchedule = () => {
        setCurrentSchedule(null);
        setShowAddEditForm(true);
    };

    const handleEditSchedule = (schedule) => {
        setCurrentSchedule(schedule);
        setShowAddEditForm(true);
    };

    const handleDeleteSchedule = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей розклад?')) {
            try {
                setLoading(true);
                const res = await axios.delete(`${API_URL}/schedules/${id}`, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Розклад успішно видалено!');
                    fetchSchedules();
                } else {
                    toast.error(res.data.error || 'Помилка видалення розкладу.');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message || 'Помилка видалення розкладу.';
                toast.error(errorMessage);
                console.error('Delete schedule error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormClose = () => {
        setShowAddEditForm(false);
        setCurrentSchedule(null);
        fetchSchedules();
    };

    if (loading && !showAddEditForm) {
        return <div className="admin-loading-message">Завантаження розкладів...</div>;
    }

    if (error && !showAddEditForm) {
        return (
            <div className="admin-error-message">
                <h3>Помилка</h3>
                <p>{error}</p>
                <p>Будь ласка, спробуйте оновити сторінку.</p>
            </div>
        );
    }

    return (
        <div className="admin-schedules-page">
            <div className="admin-header">
                <h2>Керування Розкладом</h2>
                <Button onClick={handleAddSchedule} variant="primary">
                    <FaPlus /> Додати Розклад
                </Button>
            </div>

            {showAddEditForm && (
                <AddEditScheduleForm
                    schedule={currentSchedule}
                    priests={priests}
                    onClose={handleFormClose}
                />
            )}

            {!showAddEditForm && schedules.length === 0 && (
                <div className="admin-no-data-message">Немає зареєстрованих розкладів. Додайте перший!</div>
            )}

            {!showAddEditForm && schedules.length > 0 && (
                <div className="schedules-table-container">
                    <table className="schedules-table">
                        <thead>
                            <tr>
                                <th>Початок</th>
                                <th>Кінець</th>
                                <th>Служащий</th>
                                <th>По храму</th>
                                <th>По місту</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule) => (
                                <tr key={schedule._id}>
                                    <td>{format(new Date(schedule.startDate), 'dd.MM.yyyy', { locale: uk })}</td>
                                    <td>{format(new Date(schedule.endDate), 'dd.MM.yyyy', { locale: uk })}</td>
                                    <td>{schedule.servingPriest ? schedule.servingPriest.fullName : 'Не вказано'}</td>
                                    <td>{schedule.templeDutyPriest ? schedule.templeDutyPriest.fullName : 'Не вказано'}</td>
                                    <td>{schedule.cityDutyPriest ? schedule.cityDutyPriest.fullName : 'Не вказано'}</td>
                                    <td className="actions-cell">
                                        <Button onClick={() => handleEditSchedule(schedule)} variant="outline" className="action-button">
                                            <FaEdit />
                                        </Button>
                                        <Button onClick={() => handleDeleteSchedule(schedule._id)} variant="danger" className="action-button">
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Компонент форми для додавання/редагування розкладу
const AddEditScheduleForm = ({ schedule, priests, onClose }) => {
    const initialStartDate = schedule ? format(new Date(schedule.startDate), 'yyyy-MM-dd') : '';
    const initialEndDate = schedule ? format(new Date(schedule.endDate), 'yyyy-MM-dd') : '';

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [servingPriestId, setServingPriestId] = useState(schedule?.servingPriest?._id || '');
    const [templeDutyPriestId, setTempleDutyPriestId] = useState(schedule?.templeDutyPriest?._id || '');
    const [cityDutyPriestId, setCityDutyPriestId] = useState(schedule?.cityDutyPriest?._id || '');
    const [formLoading, setFormLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валідація дат на фронтенді
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Встановлюємо час на початок дня для коректного порівняння лише дат
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (end <= start) {
            toast.error("Дата закінчення повинна бути після дати початку.");
            return;
        }

        setFormLoading(true);
        try {
            const scheduleData = {
                startDate: new Date(startDate).toISOString(), // ЗМІНА ТУТ: відправляємо ISO-рядок
                endDate: new Date(endDate).toISOString(),     // ЗМІНА ТУТ: відправляємо ISO-рядок
                servingPriest: servingPriestId || null,
                templeDutyPriest: templeDutyPriestId || null,
                cityDutyPriest: cityDutyPriestId || null,
            };

            let res;
            if (schedule) {
                res = await axios.put(`${API_URL}/schedules/${schedule._id}`, scheduleData, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Дані розкладу успішно оновлено!');
                } else {
                    toast.error(res.data.error || 'Помилка оновлення даних розкладу.');
                }
            } else {
                res = await axios.post(`${API_URL}/schedules`, scheduleData, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Розклад успішно додано!');
                } else {
                    toast.error(res.data.error || 'Помилка додавання розкладу.');
                }
            }
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Помилка збереження даних розкладу.';
            toast.error(errorMessage);
            console.error('Save schedule error:', err);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="add-edit-schedule-form-container">
            <h3>{schedule ? 'Редагувати Розклад' : 'Додати Новий Розклад'}</h3>
            <form onSubmit={handleSubmit} className="add-edit-schedule-form">
                <Input
                    label="Дата початку"
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <Input
                    label="Дата закінчення"
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />

                <div className="input-group">
                    <label htmlFor="servingPriest" className="input-label">Служащий Священник</label>
                    <select
                        id="servingPriest"
                        className="input-field"
                        value={servingPriestId}
                        onChange={(e) => setServingPriestId(e.target.value)}
                    >
                        <option value="">-- Виберіть священника --</option>
                        {priests.map((p) => (
                            <option key={p._id} value={p._id}>{p.fullName}</option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="templeDutyPriest" className="input-label">Черговий по Храму</label>
                    <select
                        id="templeDutyPriest"
                        className="input-field"
                        value={templeDutyPriestId}
                        onChange={(e) => setTempleDutyPriestId(e.target.value)}
                    >
                        <option value="">-- Виберіть священника --</option>
                        {priests.map((p) => (
                            <option key={p._id} value={p._id}>{p.fullName}</option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="cityDutyPriest" className="input-label">Черговий по Місту</label>
                    <select
                        id="cityDutyPriest"
                        className="input-field"
                        value={cityDutyPriestId}
                        onChange={(e) => setCityDutyPriestId(e.target.value)}
                    >
                        <option value="">-- Виберіть священника --</option>
                        {priests.map((p) => (
                            <option key={p._id} value={p._id}>{p.fullName}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <Button type="submit" variant="primary" disabled={formLoading}>
                        {formLoading ? 'Збереження...' : 'Зберегти'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={formLoading}>
                        Скасувати
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminSchedulesPage;
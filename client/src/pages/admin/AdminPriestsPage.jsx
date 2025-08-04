// client/src/pages/admin/AdminPriestsPage.jsx (ПОВНИЙ КОД)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '../../components/buttons/Button';
import Input from '../../components/forms/Input'; // <--- ДОДАНО: Імпорт компонента Input
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './AdminPriestsPage.css'; // Стилі для сторінки

const AdminPriestsPage = () => {
    const [priests, setPriests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddEditForm, setShowAddEditForm] = useState(false); // Для відображення/приховування форми
    const [currentPriest, setCurrentPriest] = useState(null); // Для редагування існуючого священника

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    // Функція для завантаження священників
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

    useEffect(() => {
        fetchPriests();
    }, []);

    const handleAddPriest = () => {
        setCurrentPriest(null); // Очистити дані для нової форми
        setShowAddEditForm(true);
    };

    const handleEditPriest = (priest) => {
        setCurrentPriest(priest); // Заповнити форму даними священника
        setShowAddEditForm(true);
    };

    const handleDeletePriest = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цього священника?')) {
            try {
                setLoading(true);
                const res = await axios.delete(`${API_URL}/priests/${id}`, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Священника успішно видалено!');
                    fetchPriests(); // Оновити список
                } else {
                    toast.error(res.data.error || 'Помилка видалення священника.');
                }
            } catch (err) {
                const errorMessage = err.response?.data?.error || err.message || 'Помилка видалення священника.';
                toast.error(errorMessage);
                console.error('Delete priest error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormClose = () => {
        setShowAddEditForm(false);
        setCurrentPriest(null);
        fetchPriests(); // Оновити список після додавання/редагування
    };

    if (loading && !showAddEditForm) { // Показувати завантаження, лише якщо форма не відкрита
        return <div className="admin-loading-message">Завантаження священників...</div>;
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
        <div className="admin-priests-page">
            <div className="admin-header">
                <h2>Керування Священниками</h2>
                <Button onClick={handleAddPriest} variant="primary">
                    <FaPlus /> Додати Священника
                </Button>
            </div>

            {showAddEditForm && (
                <AddEditPriestForm
                    priest={currentPriest}
                    onClose={handleFormClose}
                />
            )}

            {!showAddEditForm && priests.length === 0 && (
                <div className="admin-no-data-message">Немає зареєстрованих священників. Додайте першого!</div>
            )}

            {!showAddEditForm && priests.length > 0 && (
                <div className="priests-table-container">
                    <table className="priests-table">
                        <thead>
                            <tr>
                                <th>Ім'я</th>
                                <th>Титул</th>
                                <th>Email</th>
                                <th>Телефон</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priests.map((priest) => (
                                <tr key={priest._id}>
                                    <td>{priest.fullName}</td>
                                    <td>{priest.title}</td>
                                    <td>{priest.email || '-'}</td>
                                    <td>{priest.phone || '-'}</td>
                                    <td className="actions-cell">
                                        <Button onClick={() => handleEditPriest(priest)} variant="outline" className="action-button">
                                            <FaEdit />
                                        </Button>
                                        <Button onClick={() => handleDeletePriest(priest._id)} variant="danger" className="action-button">
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

// Компонент форми для додавання/редагування
const AddEditPriestForm = ({ priest, onClose }) => {
    const [title, setTitle] = useState(priest ? priest.title : '');
    const [fullName, setFullName] = useState(priest ? priest.fullName : '');
    const [email, setEmail] = useState(priest ? priest.email : '');
    const [phone, setPhone] = useState(priest ? priest.phone : '');
    const [formLoading, setFormLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const priestData = { title, fullName, email, phone };
            let res;
            if (priest) {
                // Редагування
                res = await axios.put(`${API_URL}/priests/${priest._id}`, priestData, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Дані священника успішно оновлено!');
                } else {
                    toast.error(res.data.error || 'Помилка оновлення даних священника.');
                }
            } else {
                // Додавання нового
                res = await axios.post(`${API_URL}/priests`, priestData, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Священника успішно додано!');
                } else {
                    toast.error(res.data.error || 'Помилка додавання священника.');
                }
            }
            onClose(); // Закрити форму та оновити список
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Помилка збереження даних священника.';
            toast.error(errorMessage);
            console.error('Save priest error:', err);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="add-edit-priest-form-container">
            <h3>{priest ? 'Редагувати Священника' : 'Додати Нового Священника'}</h3>
            <form onSubmit={handleSubmit} className="add-edit-priest-form">
                <Input
                    label="Титул (напр., Протоієрей)"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <Input
                    label="Повне ім'я (напр., Іван Петрович)"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <Input
                    label="Email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Не обов'язково"
                />
                <Input
                    label="Телефон"
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Не обов'язково"
                />
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

export default AdminPriestsPage;
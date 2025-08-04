// client/src/pages/LoginPage.jsx (ПОВНИЙ КОД)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/forms/Input';
import Button from '../components/buttons/Button';
import './Page.css'; // Загальні стилі для сторінок
import './LoginPage.css'; // Специфічні стилі для сторінки входу

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, login, loading } = useAuth(); // Отримуємо стан та функції з контексту
    const navigate = useNavigate();

    // Якщо користувач вже авторизований, перенаправити на головну
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            // Вхід успішний, навігація вже відбудеться через useEffect
        }
    };

    return (
        <div className="page-container login-page-container">
            <div className="login-form-card">
                <h2>Вхід</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введіть ваш email"
                        required
                    />
                    <Input
                        label="Пароль"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введіть ваш пароль"
                        required
                    />
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Завантаження...' : 'Увійти'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
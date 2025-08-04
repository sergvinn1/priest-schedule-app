// client/src/pages/RegisterPage.jsx (ПОВНИЙ КОД)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/forms/Input';
import Button from '../components/buttons/Button';
import './Page.css';
import './LoginPage.css'; // Можна використовувати ті ж стилі, або створити RegisterPage.css

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(username, email, password);
    };

    if (loading) {
        return <div className="loading-container">Завантаження...</div>;
    }

    return (
        <div className="page-container login-page">
            <div className="login-form-wrapper">
                <h2>Реєстрація</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <Input
                        label="Ім'я користувача"
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Пароль"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Реєстрація...' : 'Зареєструватися'}
                    </Button>
                </form>
                <p className="register-link-text">
                    Вже є обліковий запис? <Link to="/login">Увійти</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
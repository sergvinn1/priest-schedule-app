// client/src/context/AuthContext.jsx (ПОВНИЙ КОД)
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Зберігаємо інформацію про користувача
    const [loading, setLoading] = useState(true); // Для стану завантаження (наприклад, при початковій перевірці токена)
    const navigate = useNavigate(); // Для перенаправлення користувача

    // Базовий URL для API
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    // Функція для перевірки стану аутентифікації при завантаженні
    useEffect(() => {
        const checkUser = async () => {
            try {
                // Axios автоматично надсилає куки, якщо credentials: true
                const res = await axios.get(`${API_URL}/auth/me`, {
                    withCredentials: true // Важливо для надсилання куків
                });
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (error) {
                console.error('Немає авторизованого користувача або токен недійсний:', error.response?.data?.error || error.message);
                setUser(null); // Очистити користувача, якщо токен недійсний
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []); // Запускається лише один раз при завантаженні компонента

    // Функція входу
    const login = async (email, password) => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/auth/login`, { email, password }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.data.success) {
                setUser(res.data.user); // Зберігаємо user замість data.data
                toast.success(`Вітаємо, ${res.data.user.username}!`);
                return true;
            }
            return false;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Помилка входу';
            toast.error(errorMessage);
            console.error('Login error:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Функція виходу
    const logout = async () => {
        try {
            await axios.get(`${API_URL}/auth/logout`, {
                withCredentials: true
            });
            setUser(null);
            toast.info('Ви успішно вийшли.');
            navigate('/login'); // Перенаправити на сторінку входу
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Помилка виходу';
            toast.error(errorMessage);
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для зручного використання контексту
export const useAuth = () => {
    return useContext(AuthContext);
};
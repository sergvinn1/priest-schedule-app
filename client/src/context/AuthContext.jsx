// client/src/context/AuthContext.jsx (ПОВНИЙ КОД)
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Початковий стан: завантаження

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

    // Функція для перевірки стану аутентифікації при завантаженні
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
                if (res.data.success) {
                    setIsAuthenticated(true);
                    setUser(res.data.user);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (err) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false); // Завершили завантаження
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        setLoading(true); // Встановлюємо завантаження під час логіну
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
            if (res.data.success) {
                setIsAuthenticated(true);
                setUser(res.data.user);
                toast.success('Ви успішно увійшли!');
                navigate('/');
            } else {
                toast.error(res.data.error || 'Неправильні облікові дані.');
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || err.message || 'Помилка входу.');
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false); // Завершуємо завантаження
        }
    };

    const register = async (username, email, password) => {
        setLoading(true); // Встановлюємо завантаження під час реєстрації
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { username, email, password }, { withCredentials: true });
            if (res.data.success) {
                setIsAuthenticated(true);
                setUser(res.data.user);
                toast.success('Реєстрація успішна! Ви увійшли.');
                navigate('/');
            } else {
                toast.error(res.data.error || 'Помилка реєстрації.');
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || err.message || 'Помилка реєстрації.');
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false); // Завершуємо завантаження
        }
    };

    const logout = async () => {
        setLoading(true); // Встановлюємо завантаження під час виходу
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUser(null);
            toast.success('Ви успішно вийшли.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.error || err.message || 'Помилка виходу.');
        } finally {
            setLoading(false); // Завершуємо завантаження
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
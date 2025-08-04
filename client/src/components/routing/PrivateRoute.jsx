// client/src/components/routing/PrivateRoute.jsx (ПОВНИЙ КОД)
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Завантаження...</div>; // Можна додати красивий спінер
    }

    if (!user) {
        toast.warn('Будь ласка, увійдіть, щоб отримати доступ до цієї сторінки.');
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        toast.error('У вас немає дозволу для доступу до цієї сторінки.');
        return <Navigate to="/" />; // Перенаправити на головну або сторінку 403 Forbidden
    }

    return children;
};

export default PrivateRoute;
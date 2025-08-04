// client/src/layouts/AdminLayout.jsx (ПОВНИЙ КОД)
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaUserShield, FaUsers, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa'; // Іконки
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css'; // Стилі для адмін-лейауту

const AdminLayout = () => {
    const { logout } = useAuth();

    return (
        <div className="admin-dashboard-layout">
            <aside className="admin-sidebar">
                <h2 className="sidebar-title">
                    <FaUserShield /> Адмін Панель
                </h2>
                <nav className="admin-nav">
                    <ul>
                        <li>
                            <Link to="/admin/priests">
                                <FaUsers /> Священники
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/schedules">
                                <FaCalendarAlt /> Розклад
                            </Link>
                        </li>
                        {/* Додати інші посилання для адмін-функціоналу */}
                        <li>
                            <button onClick={logout} className="sidebar-logout-btn">
                                <FaSignOutAlt /> Вийти
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="admin-content">
                <Outlet /> {/* Тут будуть рендеритися вкладені маршрути (AdminPriestsPage, AdminSchedulesPage) */}
            </main>
        </div>
    );
};

export default AdminLayout;
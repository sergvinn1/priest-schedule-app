// client/src/App.jsx (ПОВНИЙ КОД)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import PriestsPage from './pages/PriestsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <--- ПЕРЕКОНАЙТЕСЯ, ЩО ЦЕЙ ІМПОРТ Є
import PrivateRoute from './components/routing/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import AdminLayout from './layouts/AdminLayout';
import AdminPriestsPage from './pages/admin/AdminPriestsPage';
import AdminSchedulesPage from './pages/admin/AdminSchedulesPage';

function App() {
    return (
        <Router> {/* Єдиний BrowserRouter для всього додатку */}
            <AuthProvider> {/* AuthProvider обгортає Routes, щоб useNavigate працював */}
                <Routes>
                    <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                    <Route path="/schedule" element={<MainLayout><SchedulePage /></MainLayout>} />
                    <Route path="/priests" element={<MainLayout><PriestsPage /></MainLayout>} />
                    <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
                    <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} /> {/* <--- ПЕРЕКОНАЙТЕСЯ, ЩО ЦЕЙ МАРШРУТ Є */}

                    {/* Маршрути для адмін-панелі, захищені PrivateRoute */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute roles={['admin']}>
                                <AdminLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<AdminPriestsPage />} />
                        <Route path="priests" element={<AdminPriestsPage />} />
                        <Route path="schedules" element={<AdminSchedulesPage />} />
                    </Route>

                    {/* Додамо 404 сторінку пізніше */}
                    {/* <Route path="*" element={<NotFoundPage />} /> */}
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
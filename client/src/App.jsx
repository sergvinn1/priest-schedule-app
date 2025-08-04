// client/src/App.jsx (ПОВНИЙ КОД)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import PriestsPage from './pages/PriestsPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/routing/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import AdminLayout from './layouts/AdminLayout'; // Імпортуємо AdminLayout
import AdminPriestsPage from './pages/admin/AdminPriestsPage'; // Будемо створювати
import AdminSchedulesPage from './pages/admin/AdminSchedulesPage'; // Будемо створювати

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                    <Route path="/schedule" element={<MainLayout><SchedulePage /></MainLayout>} />
                    <Route path="/priests" element={<MainLayout><PriestsPage /></MainLayout>} />
                    <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />

                    {/* Маршрути для адмін-панелі */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute roles={['admin']}>
                                <AdminLayout /> {/* AdminLayout буде містити вкладені маршрути */}
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<AdminPriestsPage />} /> {/* Головна сторінка адмінки - список священників */}
                        <Route path="priests" element={<AdminPriestsPage />} />
                        <Route path="schedules" element={<AdminSchedulesPage />} />
                        {/* Додати маршрути для додавання/редагування пізніше */}
                        {/* <Route path="priests/new" element={<AdminAddPriestPage />} /> */}
                        {/* <Route path="priests/edit/:id" element={<AdminEditPriestPage />} /> */}
                    </Route>

                    {/* Додамо 404 сторінку пізніше */}
                    {/* <Route path="*" element={<NotFoundPage />} /> */}
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
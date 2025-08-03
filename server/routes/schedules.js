// server/routes/schedules.js
const express = require('express');
const {
    getSchedules,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule
} = require('../controllers/schedules');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(getSchedules) // Перегляд всіх доступний всім
    .post(protect, authorize('admin'), createSchedule); // Створення - тільки адмін

router
    .route('/:id')
    .get(getSchedule) // Перегляд одного доступний всім
    .put(protect, authorize('admin'), updateSchedule) // Оновлення - тільки адмін
    .delete(protect, authorize('admin'), deleteSchedule); // Видалення - тільки адмін

module.exports = router;
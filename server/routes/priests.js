// server/routes/priests.js
const express = require('express');
const {
    getPriests,
    getPriest,
    createPriest,
    updatePriest,
    deletePriest
} = require('../controllers/priests');

const { protect, authorize } = require('../middleware/auth'); // Імпортуємо middleware захисту

const router = express.Router();

// Захищені маршрути для адміна
router
    .route('/')
    .get(getPriests) // Перегляд всіх доступний всім
    .post(protect, authorize('admin'), createPriest); // Створення - тільки адмін

router
    .route('/:id')
    .get(getPriest) // Перегляд одного доступний всім
    .put(protect, authorize('admin'), updatePriest) // Оновлення - тільки адмін
    .delete(protect, authorize('admin'), deletePriest); // Видалення - тільки адмін

module.exports = router;
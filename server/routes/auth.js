// server/routes/auth.js
const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth'); // Переконайтеся, що logout імпортується
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Захищений маршрут для отримання інформації про користувача
router.post('/logout', logout); // <--- ПЕРЕКОНАЙТЕСЯ, ЩО ЦЕЙ РЯДОК ІСНУЄ І ПРАВИЛЬНИЙ

module.exports = router;
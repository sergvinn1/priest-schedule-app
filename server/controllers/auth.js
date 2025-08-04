// server/controllers/auth.js (ПОВНИЙ КОД З ВИПРАВЛЕННЯМИ)
const User = require('../models/User');
const asyncHandler = require('../middleware/async'); // <--- Переконайтеся, що шлях правильний
const ErrorResponse = require('../utils/errorResponse'); // <--- Переконайтеся, що шлях правильний
const sendTokenResponse = require('../utils/sendTokenResponse');

// @desc    Реєстрація користувача
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    // Створення користувача
    const user = await User.create({
        username,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});

// @desc    Вхід користувача
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Валідація email та пароля
    if (!email || !password) {
        return next(new ErrorResponse('Будь ласка, вкажіть email та пароль', 400));
    }

    // Перевірка користувача
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Недійсні облікові дані', 401));
    }

    // Перевірка пароля
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Недійсні облікові дані', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Отримати інформацію про поточного користувача
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = req.user; // Користувач додається в req.user через middleware protect

    res.status(200).json({
        success: true,
        user
    });
});

// @desc    Вийти (очистити cookie)
// @route   POST /api/v1/auth/logout
// @access  Private (або Public, якщо просто очищаємо cookie)
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Встановлюємо термін дії на 10 секунд у майбутньому
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // Використовуємо secure тільки на продакшені
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});
// server/controllers/auth.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken'); // Хоча він вже використовується в моделі User, можна явно імпортувати тут для читабельності, якщо потрібно

// Функція для надсилання JWT токена
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken(); // Метод defined in User model

    const options = {
        expires: new Date(Date.now() + (+process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000), // Наприклад, 30 днів
        httpOnly: true // Запобігає доступу до куки з клієнтського JavaScript
    };

    // Тільки для HTTPS в продакшені
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    const { username, email, password, role } = req.body;

    try {
        const user = await User.create({
            username,
            email,
            password,
            role
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err); // Передаємо помилку в middleware для обробки
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Валідація наявності email та пароля
    if (!email || !password) {
        return next(new ErrorResponse('Будь ласка, введіть email та пароль', 400));
    }

    try {
        // Перевіряємо, чи існує користувач (select('+password') щоб отримати поле password)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Недійсні облікові дані', 401));
        }

        // Перевіряємо пароль
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Недійсні облікові дані', 401));
        }

        sendTokenResponse(user, 200, res);

    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        // req.user буде доступний після middleware захисту (який ми ще напишемо)
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Кука зникне через 10 секунд
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};
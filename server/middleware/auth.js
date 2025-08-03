// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        // Set token from cookie
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Не авторизовано для доступу до цього маршруту', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorResponse('Користувача, що належить цьому токену, більше не існує', 401));
        }

        next();
    } catch (err) {
        return next(new ErrorResponse('Не авторизовано для доступу до цього маршруту', 401));
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `Користувач з роллю ${req.user.role} не авторизований для доступу до цього маршруту`,
                    403
                )
            );
        }
        next();
    };
};
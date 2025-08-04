// server/utils/sendTokenResponse.js (ПОВНИЙ КОД)
const sendTokenResponse = (user, statusCode, res) => {
    // Створюємо JWT токен
    const token = user.getSignedJwtToken();

    const cookieOptions = {
        // Перетворюємо JWT_COOKIE_EXPIRE на число, бо process.env повертає рядок
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE, 10) * 24 * 60 * 60 * 1000), // <--- ВИПРАВЛЕННЯ ТУТ
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // Використовувати secure cookie тільки на продакшені
    };

    // Якщо додаток працює в режимі production, встановлюємо secure: true
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.status(statusCode).cookie('token', token, cookieOptions).json({
        success: true,
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
};

module.exports = sendTokenResponse;
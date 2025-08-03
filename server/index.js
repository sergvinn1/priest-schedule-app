// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Для парсингу куків

const authRoutes = require('./routes/auth'); // Імпортуємо маршрути аутентифікації
const priestRoutes = require('./routes/priests'); // Імпортуємо маршрути священників
const errorHandler = require('./middleware/error'); // Імпортуємо middleware для обробки помилок

// Завантажуємо змінні середовища з .env файлу
dotenv.config({ path: './.env' }); // Переконайтесь, що шлях правильний, якщо .env не в корені server/

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Для парсингу JSON тіла запиту
app.use(cookieParser()); // Додаємо cookieParser
app.use(cors({
    origin: 'http://localhost:5173', // Дозволити запити з нашого React додатку
    credentials: true // Дозволити надсилання куків
}));


// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Вийти з процесу, якщо не вдалося підключитися
    });

// Підключення маршрутів
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/priests', priestRoutes);

// Це має бути останнім middleware!
app.use(errorHandler); // Додаємо middleware для обробки помилок

const server = app.listen(port, () => {
    console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

// Обробка неперехоплених відхилених промісів
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Закрити сервер і вийти з процесу
    server.close(() => process.exit(1));
});
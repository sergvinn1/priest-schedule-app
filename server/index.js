// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const priestRoutes = require('./routes/priests');
const scheduleRoutes = require('./routes/schedules'); // Імпортуємо маршрути розкладів
const errorHandler = require('./middleware/error');

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Підключення маршрутів
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/priests', priestRoutes);
app.use('/api/v1/schedules', scheduleRoutes); // Додаємо маршрути розкладів

// Це має бути останнім middleware!
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
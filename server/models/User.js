// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Для хешування паролів
const jwt = require('jsonwebtoken'); // Для генерації JWT токенів

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Будь ласка, вкажіть ім\'я користувача'],
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Будь ласка, вкажіть email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Будь ласка, вкажіть дійсний email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Будь ласка, вкажіть пароль'],
        minlength: 6,
        select: false // Не повертати пароль при запитах
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Може бути user або admin
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Хешування пароля перед збереженням
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Генерація JWT токена
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1h' // Термін дії токена
    });
};

// Порівняння введеного пароля з хешованим
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
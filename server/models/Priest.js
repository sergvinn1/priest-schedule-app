// server/models/Priest.js
const mongoose = require('mongoose');

const PriestSchema = new mongoose.Schema({
    title: { // Протоієрей, Архімандрит, і т.д.
        type: String,
        required: [true, 'Будь ласка, вкажіть титул священника'],
        trim: true,
        maxlength: [50, 'Титул не може перевищувати 50 символів']
    },
    fullName: { // Віталій Голоскевич
        type: String,
        required: [true, 'Будь ласка, вкажіть повне ім\'я священника'],
        unique: true, // Кожне ім'я має бути унікальним
        trim: true,
        maxlength: [100, 'Повне ім\'я не може перевищувати 100 символів']
    },
    // Можна додати інші поля пізніше, наприклад, photo, description, phone
    // photo: {
    //     type: String,
    //     default: 'no-photo.jpg'
    // },
    // description: {
    //     type: String,
    //     maxlength: [500, 'Опис не може перевищувати 500 символів']
    // }
}, {
    timestamps: true // Автоматично додає createdAt та updatedAt поля
});

module.exports = mongoose.model('Priest', PriestSchema);
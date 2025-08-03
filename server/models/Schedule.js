// server/models/Schedule.js
const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: [true, 'Будь ласка, вкажіть дату початку чергування']
    },
    endDate: {
        type: Date,
        required: [true, 'Будь ласка, вкажіть дату кінця чергування']
    },
    servingPriest: { // Служащий
        type: mongoose.Schema.ObjectId,
        ref: 'Priest',
        required: [true, 'Будь ласка, вкажіть служащого священника']
    },
    templeDutyPriest: { // Черговий по храму
        type: mongoose.Schema.ObjectId,
        ref: 'Priest',
        required: [true, 'Будь ласка, вкажіть чергового по храму священника']
    },
    cityDutyPriest: { // Черговий по місту
        type: mongoose.Schema.ObjectId,
        ref: 'Priest',
        required: [true, 'Будь ласка, вкажіть чергового по місту священника']
    },
    // Можна додати інші поля, наприклад, notes, event_type
    // notes: {
    //     type: String,
    //     maxlength: [300, 'Примітки не можуть перевищувати 300 символів']
    // }
}, {
    timestamps: true // Автоматично додає createdAt та updatedAt поля
});

// Валідація, щоб endDate була після startDate
ScheduleSchema.path('endDate').validate(function (value) {
    return this.startDate <= value;
}, 'Дата закінчення повинна бути після дати початку.');

module.exports = mongoose.model('Schedule', ScheduleSchema);
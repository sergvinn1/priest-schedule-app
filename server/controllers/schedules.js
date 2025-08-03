// server/controllers/schedules.js
const Schedule = require('../models/Schedule');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all schedules
// @route   GET /api/v1/schedules
// @access  Public (with optional date range filter)
exports.getSchedules = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // Поля для виключення
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc.)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Schedule.find(JSON.parse(queryStr));

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('startDate'); // Сортувати за датою початку за замовчуванням
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Schedule.countDocuments(JSON.parse(queryStr)); // Підрахунок загальної кількості з фільтрами

        query = query.skip(startIndex).limit(limit);

        // Populate references (завантажити інформацію про священників)
        query = query
            .populate('servingPriest', 'title fullName')
            .populate('templeDutyPriest', 'title fullName')
            .populate('cityDutyPriest', 'title fullName');

        const schedules = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: schedules.length,
            pagination,
            data: schedules
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single schedule
// @route   GET /api/v1/schedules/:id
// @access  Public
exports.getSchedule = async (req, res, next) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate('servingPriest', 'title fullName')
            .populate('templeDutyPriest', 'title fullName')
            .populate('cityDutyPriest', 'title fullName');

        if (!schedule) {
            return next(new ErrorResponse(`Розклад з ID ${req.params.id} не знайдено`, 404));
        }

        res.status(200).json({
            success: true,
            data: schedule
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new schedule
// @route   POST /api/v1/schedules
// @access  Private (Admin only)
exports.createSchedule = async (req, res, next) => {
    try {
        // Перевірка на перетин дат
        const { startDate, endDate, servingPriest, templeDutyPriest, cityDutyPriest } = req.body;

        const existingSchedule = await Schedule.findOne({
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        });

        if (existingSchedule) {
            return next(new ErrorResponse('Розклад на цей період вже існує або перетинається з існуючим.', 400));
        }

        // Перевірка, чи всі священники різні в одному записі розкладу
        const priests = [servingPriest, templeDutyPriest, cityDutyPriest];
        const uniquePriests = new Set(priests);
        if (uniquePriests.size !== priests.length) {
            return next(new ErrorResponse('Один і той же священник не може займати декілька ролей в одному розкладі.', 400));
        }


        const schedule = await Schedule.create(req.body);
        res.status(201).json({
            success: true,
            data: schedule
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update schedule
// @route   PUT /api/v1/schedules/:id
// @access  Private (Admin only)
exports.updateSchedule = async (req, res, next) => {
    try {
         // Перевірка на перетин дат
        const { startDate, endDate, servingPriest, templeDutyPriest, cityDutyPriest } = req.body;

        const existingSchedule = await Schedule.findOne({
            _id: { $ne: req.params.id }, // Виключити поточний документ
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        });

        if (existingSchedule) {
            return next(new ErrorResponse('Оновлений розклад на цей період перетинається з існуючим.', 400));
        }

        // Перевірка, чи всі священники різні в одному записі розкладу
        const priests = [servingPriest, templeDutyPriest, cityDutyPriest];
        const uniquePriests = new Set(priests);
        if (uniquePriests.size !== priests.length) {
            return next(new ErrorResponse('Один і той же священник не може займати декілька ролей в одному розкладі.', 400));
        }

        const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!schedule) {
            return next(new ErrorResponse(`Розклад з ID ${req.params.id} не знайдено`, 404));
        }

        res.status(200).json({
            success: true,
            data: schedule
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete schedule
// @route   DELETE /api/v1/schedules/:id
// @access  Private (Admin only)
exports.deleteSchedule = async (req, res, next) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);

        if (!schedule) {
            return next(new ErrorResponse(`Розклад з ID ${req.params.id} не знайдено`, 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
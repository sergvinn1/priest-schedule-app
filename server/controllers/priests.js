// server/controllers/priests.js
const Priest = require('../models/Priest');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all priests
// @route   GET /api/v1/priests
// @access  Public
exports.getPriests = async (req, res, next) => {
    try {
        const priests = await Priest.find();
        res.status(200).json({
            success: true,
            count: priests.length,
            data: priests
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single priest
// @route   GET /api/v1/priests/:id
// @access  Public
exports.getPriest = async (req, res, next) => {
    try {
        const priest = await Priest.findById(req.params.id);

        if (!priest) {
            return next(new ErrorResponse(`Священника з ID ${req.params.id} не знайдено`, 404));
        }

        res.status(200).json({
            success: true,
            data: priest
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new priest
// @route   POST /api/v1/priests
// @access  Private (Admin only)
exports.createPriest = async (req, res, next) => {
    try {
        const priest = await Priest.create(req.body);
        res.status(201).json({
            success: true,
            data: priest
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update priest
// @route   PUT /api/v1/priests/:id
// @access  Private (Admin only)
exports.updatePriest = async (req, res, next) => {
    try {
        const priest = await Priest.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Повернути оновлений документ
            runValidators: true // Запустити валідатори схеми
        });

        if (!priest) {
            return next(new ErrorResponse(`Священника з ID ${req.params.id} не знайдено`, 404));
        }

        res.status(200).json({
            success: true,
            data: priest
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete priest
// @route   DELETE /api/v1/priests/:id
// @access  Private (Admin only)
exports.deletePriest = async (req, res, next) => {
    try {
        const priest = await Priest.findByIdAndDelete(req.params.id);

        if (!priest) {
            return next(new ErrorResponse(`Священника з ID ${req.params.id} не знайдено`, 404));
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
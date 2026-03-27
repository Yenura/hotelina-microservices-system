const Reservation = require('../models/Reservation');
const { validationResult } = require('express-validator');

// ─── Helper ───────────────────────────────────────────────────────────────────
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return true;
  }
  return false;
};

// ─── CREATE ───────────────────────────────────────────────────────────────────
/**
 * @desc   Create a new reservation
 * @route  POST /api/reservations
 * @access Public
 */
const createReservation = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { guestId, roomNumber, checkInDate, checkOutDate, status } = req.body;

    const reservation = await Reservation.create({
      guestId,
      roomNumber,
      checkInDate,
      checkOutDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// ─── READ ALL ─────────────────────────────────────────────────────────────────
/**
 * @desc   Get all reservations (with optional filters)
 * @route  GET /api/reservations
 * @access Public
 */
const getAllReservations = async (req, res, next) => {
  try {
    const { guestId, roomNumber, status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (guestId) filter.guestId = guestId;
    if (roomNumber) filter.roomNumber = roomNumber;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Reservation.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: reservations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── READ ONE ─────────────────────────────────────────────────────────────────
/**
 * @desc   Get a single reservation by ID
 * @route  GET /api/reservations/:id
 * @access Public
 */
const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
/**
 * @desc   Update a reservation by ID
 * @route  PUT /api/reservations/:id
 * @access Public
 */
const updateReservation = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────────
/**
 * @desc   Delete a reservation by ID
 * @route  DELETE /api/reservations/:id
 * @access Public
 */
const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────
/**
 * @desc   Update only the status of a reservation
 * @route  PATCH /api/reservations/:id/status
 * @access Public
 */
const updateReservationStatus = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) return;

    const { status } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Reservation with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation status updated successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET BY GUEST ─────────────────────────────────────────────────────────────
/**
 * @desc   Get all reservations for a specific guest
 * @route  GET /api/reservations/guest/:guestId
 * @access Public
 */
const getReservationsByGuest = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ guestId: req.params.guestId }).sort({
      checkInDate: -1,
    });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  getReservationsByGuest,
};

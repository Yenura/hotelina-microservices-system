const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  getReservationsByGuest,
} = require('../controllers/reservationController');

// ─── Validation Rules ─────────────────────────────────────────────────────────
const reservationValidation = [
  body('guestId')
    .notEmpty().withMessage('guestId is required')
    .isString().withMessage('guestId must be a string'),
  body('roomNumber')
    .notEmpty().withMessage('roomNumber is required')
    .isString().withMessage('roomNumber must be a string'),
  body('checkInDate')
    .notEmpty().withMessage('checkInDate is required')
    .isISO8601().withMessage('checkInDate must be a valid date (YYYY-MM-DD)'),
  body('checkOutDate')
    .notEmpty().withMessage('checkOutDate is required')
    .isISO8601().withMessage('checkOutDate must be a valid date (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkInDate)) {
        throw new Error('checkOutDate must be after checkInDate');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('status must be one of: pending, confirmed, cancelled, completed'),
];

const updateValidation = [
  body('guestId').optional().isString().withMessage('guestId must be a string'),
  body('roomNumber').optional().isString().withMessage('roomNumber must be a string'),
  body('checkInDate').optional().isISO8601().withMessage('checkInDate must be a valid date'),
  body('checkOutDate')
    .optional()
    .isISO8601().withMessage('checkOutDate must be a valid date'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status value'),
];

const statusValidation = [
  body('status')
    .notEmpty().withMessage('status is required')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('status must be one of: pending, confirmed, cancelled, completed'),
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid reservation ID format'),
];


// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Retrieve all reservations
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: guestId
 *         schema: { type: string }
 *         description: Filter by guest ID
 *       - in: query
 *         name: roomNumber
 *         schema: { type: string }
 *         description: Filter by room number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Results per page
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *                 pagination:
 *                   type: object
 */
router.get('/', getAllReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Reservation MongoDB ID
 *     responses:
 *       200:
 *         description: Reservation found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', mongoIdValidation, getReservationById);

/**
 * @swagger
 * /api/reservations/guest/{guestId}:
 *   get:
 *     summary: Get all reservations for a specific guest
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: guestId
 *         required: true
 *         schema: { type: string }
 *         description: Guest ID
 *     responses:
 *       200:
 *         description: List of reservations for the guest
 */
router.get('/guest/:guestId', getReservationsByGuest);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', reservationValidation, createReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationInput'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       404:
 *         description: Reservation not found
 */
router.put('/:id', [...mongoIdValidation, ...updateValidation], updateReservation);

/**
 * @swagger
 * /api/reservations/{id}/status:
 *   patch:
 *     summary: Update only the status of a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Reservation not found
 */
router.patch('/:id/status', [...mongoIdValidation, ...statusValidation], updateReservationStatus);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 */
router.delete('/:id', mongoIdValidation, deleteReservation);

module.exports = router;

const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - guestId
 *         - roomNumber
 *         - checkInDate
 *         - checkOutDate
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *         guestId:
 *           type: string
 *           description: ID of the guest making the reservation
 *           example: "65a1b2c3d4e5f6a7b8c9d0e1"
 *         roomNumber:
 *           type: string
 *           description: Room number being reserved
 *           example: "101"
 *         checkInDate:
 *           type: string
 *           format: date
 *           description: Check-in date (YYYY-MM-DD)
 *           example: "2026-04-01"
 *         checkOutDate:
 *           type: string
 *           format: date
 *           description: Check-out date (YYYY-MM-DD)
 *           example: "2026-04-05"
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           default: pending
 *           description: Current status of the reservation
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ReservationInput:
 *       type: object
 *       required:
 *         - guestId
 *         - roomNumber
 *         - checkInDate
 *         - checkOutDate
 *       properties:
 *         guestId:
 *           type: string
 *           example: "65a1b2c3d4e5f6a7b8c9d0e1"
 *         roomNumber:
 *           type: string
 *           example: "101"
 *         checkInDate:
 *           type: string
 *           format: date
 *           example: "2026-04-01"
 *         checkOutDate:
 *           type: string
 *           format: date
 *           example: "2026-04-05"
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           example: "pending"
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 */

const reservationSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: [true, 'Guest ID is required'],
      trim: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
      validate: {
        validator: function (value) {
          return value > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed'],
        message: 'Status must be one of: pending, confirmed, cancelled, completed',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for common query patterns
reservationSchema.index({ guestId: 1 });
reservationSchema.index({ roomNumber: 1, checkInDate: 1, checkOutDate: 1 });
reservationSchema.index({ status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);

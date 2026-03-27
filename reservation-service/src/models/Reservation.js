const mongoose = require('mongoose');


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

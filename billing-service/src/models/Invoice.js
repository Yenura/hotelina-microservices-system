const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Guest',
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Reservation',
    },
    roomCharges: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    restaurantCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    additionalCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    balanceDue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check'],
      default: null,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to calculate balance due
invoiceSchema.virtual('calculatedBalance').get(function () {
  return this.totalAmount - this.amountPaid;
});

// Pre-save hook to calculate tax and total amount
invoiceSchema.pre('save', function (next) {
  const subtotal =
    this.roomCharges +
    this.restaurantCharges +
    this.additionalCharges -
    this.discount;
  this.tax = subtotal * (this.taxRate / 100);
  this.totalAmount = subtotal + this.tax;
  this.balanceDue = this.totalAmount - this.amountPaid;

  // Update payment status based on amount paid
  if (this.amountPaid >= this.totalAmount) {
    this.paymentStatus = 'completed';
  } else if (this.amountPaid > 0 && this.amountPaid < this.totalAmount) {
    this.paymentStatus = 'partial';
  }

  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);

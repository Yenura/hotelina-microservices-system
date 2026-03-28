const express = require('express');
const { body } = require('express-validator');
const billingController = require('../controllers/billingController');

const router = express.Router();

// ─── Validation Middleware ────────────────────────────────────────────────────
const validateInvoice = [
  body('invoiceNumber')
    .trim()
    .notEmpty()
    .withMessage('Invoice number is required'),
  body('guestId')
    .trim()
    .notEmpty()
    .withMessage('Guest ID is required'),
  body('reservationId')
    .trim()
    .notEmpty()
    .withMessage('Reservation ID is required'),
  body('roomCharges')
    .isFloat({ min: 0 })
    .withMessage('Room charges must be a non-negative number'),
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

const validatePayment = [
  body('amountPaid')
    .isFloat({ min: 0.01 })
    .withMessage('Amount paid must be greater than 0'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check'])
    .withMessage('Invalid payment method'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────
// Create new invoice
router.post('/', validateInvoice, billingController.createInvoice);

// Get all invoices with filters and pagination
router.get('/', billingController.getAllInvoices);

// Get payment statistics
router.get('/statistics', billingController.getPaymentStats);

// Get invoice by ID
router.get('/:id', billingController.getInvoiceById);

// Update invoice
router.patch('/:id', billingController.updateInvoice);

// Record payment for an invoice
router.post('/:id/payment', validatePayment, billingController.recordPayment);

// Delete invoice
router.delete('/:id', billingController.deleteInvoice);

module.exports = router;

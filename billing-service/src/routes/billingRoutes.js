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

// ─── Swagger API Documentation ───────────────────────────────────────────────
/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       required:
 *         - invoiceNumber
 *         - guestId
 *         - reservationId
 *         - roomCharges
 *         - dueDate
 *       properties:
 *         _id:
 *           type: string
 *         invoiceNumber:
 *           type: string
 *         guestId:
 *           type: string
 *         reservationId:
 *           type: string
 *         roomCharges:
 *           type: number
 *         tax:
 *           type: number
 *         total:
 *           type: number
 *         paid:
 *           type: number
 *         dueDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [pending, paid, overdue]
 *     InvoiceCreate:
 *       allOf:
 *         - $ref: '#/components/schemas/Invoice'
 *       required:
 *         - invoiceNumber
 *         - guestId
 *         - reservationId
 *         - roomCharges
 *         - dueDate
 *     Payment:
 *       type: object
 *       required:
 *         - amountPaid
 *       properties:
 *         amountPaid:
 *           type: number
 *         paymentMethod:
 *           type: string
 *           enum: [cash, credit_card, debit_card, bank_transfer, check]
 *
 * /api/billing:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceCreate'
 *     responses:
 *       201:
 *         description: Invoice created
 *       400:
 *         description: Invalid request
 *   get:
 *     summary: Get all invoices
 *     tags: [Billing]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *     responses:
 *       200:
 *         description: List of invoices
 *
 * /api/billing/statistics:
 *   get:
 *     summary: Get billing stats
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: Statistics data
 *
 * /api/billing/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice details
 *       404:
 *         description: Not found
 *   patch:
 *     summary: Update invoice by ID
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: Updated invoice
 *   delete:
 *     summary: Delete invoice
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 *
 * /api/billing/{id}/payment:
 *   post:
 *     summary: Record payment for an invoice
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Payment recorded
 */

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

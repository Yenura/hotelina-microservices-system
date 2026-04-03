const express = require('express');
const { body } = require('express-validator');
const billingController = require('../controllers/billingController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Billing
 *   description: Invoice and billing management operations
 */

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

/**
 * @swagger
 * /api/billing:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [invoiceNumber, guestId, reservationId, roomCharges, dueDate]
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *                 example: "INV-001"
 *               guestId:
 *                 type: string
 *                 example: "guest123"
 *               reservationId:
 *                 type: string
 *                 example: "res123"
 *               roomCharges:
 *                 type: number
 *                 example: 150.00
 *               restaurantCharges:
 *                 type: number
 *               additionalCharges:
 *                 type: number
 *               discount:
 *                 type: number
 *               taxRate:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Invoice number already exists
 */
router.post('/', validateInvoice, billingController.createInvoice);

/**
 * @swagger
 * /api/billing:
 *   get:
 *     summary: Get all invoices with filters and pagination
 *     tags: [Billing]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [paid, unpaid, partial]
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get('/', billingController.getAllInvoices);

/**
 * @swagger
 * /api/billing/statistics:
 *   get:
 *     summary: Get payment statistics
 *     tags: [Billing]
 *     responses:
 *       200:
 *         description: Payment statistics
 */
router.get('/statistics', billingController.getPaymentStats);

/**
 * @swagger
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
 *         description: Invoice not found
 */
router.get('/:id', billingController.getInvoiceById);

/**
 * @swagger
 * /api/billing/{id}:
 *   patch:
 *     summary: Update invoice
 *     tags: [Billing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       404:
 *         description: Invoice not found
 */
router.patch('/:id', billingController.updateInvoice);

/**
 * @swagger
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
 *             type: object
 *             required: [amountPaid]
 *             properties:
 *               amountPaid:
 *                 type: number
 *                 example: 100.00
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, credit_card, debit_card, bank_transfer, check]
 *     responses:
 *       200:
 *         description: Payment recorded successfully
 *       404:
 *         description: Invoice not found
 */
router.post('/:id/payment', validatePayment, billingController.recordPayment);

/**
 * @swagger
 * /api/billing/{id}:
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
 *       200:
 *         description: Invoice deleted successfully
 *       404:
 *         description: Invoice not found
 */
router.delete('/:id', billingController.deleteInvoice);

module.exports = router;

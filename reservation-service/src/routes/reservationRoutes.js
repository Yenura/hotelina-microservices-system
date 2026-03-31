const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management
 *
 * /api/reservations:
 *   post:
 *     summary: Create a reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guestId:
 *                 type: string
 *               roomId:
 *                 type: string
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Reservation created
 *   get:
 *     summary: Get list of reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: OK
 *
 * /api/reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *   put:
 *     summary: Update reservation
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete reservation
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */

router.post('/', controller.createReservation);
router.get('/', controller.getReservations);
router.get('/:id', controller.getReservationById);
router.put('/:id', controller.updateReservation);
router.delete('/:id', controller.deleteReservation);

module.exports = router;

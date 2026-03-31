const express = require("express");
const router = express.Router();
const controller = require("../controllers/guestController");
const protect = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Guests
 *   description: Guest management endpoints
 */

/**
 * @swagger
 * /api/guests:
 *   post:
 *     summary: Create a new guest
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuestInput'
 *           example:
 *             name: "John Doe"
 *             email: "john.doe@example.com"
 *             phone: "+94771234567"
 *             address: "123 Main Street, Colombo"
 *             nic: "199012345678"
 *     responses:
 *       201:
 *         description: Guest created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuestResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email or NIC already exists
 */
router.post("/", protect, controller.createGuest);

/**
 * @swagger
 * /api/guests:
 *   get:
 *     summary: Get all guests (with optional pagination & filters)
 *     tags: [Guests]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter/search by email (partial match)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter/search by name (partial match)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, blocked]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of guests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuestListResponse'
 */
router.get("/", controller.getGuests);

/**
 * @swagger
 * /api/guests/search:
 *   get:
 *     summary: Search guests by email
 *     tags: [Guests]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email address to search for
 *     responses:
 *       200:
 *         description: Matching guests
 *       400:
 *         description: Missing email query param
 */
router.get("/search", controller.searchByEmail);

/**
 * @swagger
 * /api/guests/{id}:
 *   get:
 *     summary: Get a guest by ID
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the guest
 *     responses:
 *       200:
 *         description: Guest found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuestResponse'
 *       404:
 *         description: Guest not found
 */
router.get("/:id", controller.getGuestById);

/**
 * @swagger
 * /api/guests/{id}:
 *   put:
 *     summary: Update a guest
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the guest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuestInput'
 *           example:
 *             name: "Jane Doe"
 *             phone: "+94779876543"
 *             address: "456 New Road, Galle"
 *     responses:
 *       200:
 *         description: Guest updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Guest not found
 */
router.put("/:id", protect, controller.updateGuest);

/**
 * @swagger
 * /api/guests/{id}:
 *   delete:
 *     summary: Delete a guest
 *     tags: [Guests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the guest
 *     responses:
 *       200:
 *         description: Guest deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Guest not found
 */
router.delete("/:id", protect, controller.deleteGuest);

module.exports = router;

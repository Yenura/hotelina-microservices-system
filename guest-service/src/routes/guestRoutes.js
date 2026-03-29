const express = require("express");
const router = express.Router();
const controller = require("../controllers/guestController");

// CRUD Routes
router.post("/", controller.createGuest);
router.get("/", controller.getGuests);
router.get("/:id", controller.getGuestById);
router.put("/:id", controller.updateGuest);
router.delete("/:id", controller.deleteGuest);

module.exports = router;

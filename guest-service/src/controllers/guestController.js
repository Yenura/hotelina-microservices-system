const Guest = require("../models/Guest");

// CREATE - Add a new guest
exports.createGuest = async (req, res) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json({
      success: true,
      message: "Guest created successfully",
      data: guest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// GET ALL - Retrieve all guests
exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// GET ONE - Retrieve a single guest by ID
exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({
        success: false,
        error: "Guest not found",
      });
    }
    res.json({
      success: true,
      data: guest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// UPDATE - Update guest information
exports.updateGuest = async (req, res) => {
  try {
    const updated = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Guest not found",
      });
    }
    res.json({
      success: true,
      message: "Guest updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// DELETE - Remove a guest
exports.deleteGuest = async (req, res) => {
  try {
    const deleted = await Guest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Guest not found",
      });
    }
    res.json({
      success: true,
      message: "Guest deleted successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const Guest = require("../models/Guest");

// ─── CREATE ────────────────────────────────────────────────────────────────────
exports.createGuest = async (req, res, next) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json({
      success: true,
      message: "Guest created successfully",
      data: guest,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET ALL (with pagination & search by email) ───────────────────────────────
exports.getGuests = async (req, res, next) => {
  try {
    // Pagination
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" };
    }
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [guests, total] = await Promise.all([
      Guest.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Guest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: guests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: guests,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET BY ID ─────────────────────────────────────────────────────────────────
exports.getGuestById = async (req, res, next) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }
    res.json({ success: true, data: guest });
  } catch (err) {
    next(err);
  }
};

// ─── SEARCH BY EMAIL ───────────────────────────────────────────────────────────
exports.searchByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email query parameter is required",
      });
    }
    const guests = await Guest.find({
      email: { $regex: email, $options: "i" },
    });
    res.json({ success: true, count: guests.length, data: guests });
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE ────────────────────────────────────────────────────────────────────
exports.updateGuest = async (req, res, next) => {
  try {
    const updated = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }
    res.json({
      success: true,
      message: "Guest updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE ────────────────────────────────────────────────────────────────────
exports.deleteGuest = async (req, res, next) => {
  try {
    const deleted = await Guest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }
    res.json({
      success: true,
      message: "Guest deleted successfully",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

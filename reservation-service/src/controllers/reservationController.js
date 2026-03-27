const Reservation = require('../models/reservationModel');

// CREATE
exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getReservations = async (req, res) => {
  try {
    const data = await Reservation.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
exports.getReservationById = async (req, res) => {
  try {
    const data = await Reservation.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Reservation not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateReservation = async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Reservation not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Reservation not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

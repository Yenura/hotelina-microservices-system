const Invoice = require('../models/Invoice');
const { validationResult } = require('express-validator');

// ─── Create Invoice ────────────────────────────────────────────────────────
exports.createInvoice = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      invoiceNumber,
      guestId,
      reservationId,
      roomCharges,
      restaurantCharges,
      additionalCharges,
      discount,
      taxRate,
      dueDate,
      notes,
    } = req.body;

    // Check if invoice number already exists
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: 'Invoice number already exists',
      });
    }

    const invoice = new Invoice({
      invoiceNumber,
      guestId,
      reservationId,
      roomCharges,
      restaurantCharges,
      additionalCharges,
      discount,
      taxRate,
      dueDate,
      notes,
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get All Invoices ─────────────────────────────────────────────────────
exports.getAllInvoices = async (req, res, next) => {
  try {
    const { status, guestId, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = {};
    if (status) {
      filter.paymentStatus = status;
    }
    if (guestId) {
      filter.guestId = guestId;
    }

    const skip = (page - 1) * limit;

    const invoices = await Invoice.find(filter)
      .populate('guestId', 'name email phone')
      .populate('reservationId', 'roomType checkInDate checkOutDate')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ invoiceDate: -1 });

    const totalCount = await Invoice.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: invoices,
      pagination: {
        totalCount,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Invoice by ID ─────────────────────────────────────────────────────
exports.getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate('guestId', 'name email phone address')
      .populate('reservationId', 'roomType checkInDate checkOutDate roomNumber');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update Invoice ───────────────────────────────────────────────────────
exports.updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow updating invoiceNumber or IDs
    delete updates.invoiceNumber;
    delete updates.guestId;
    delete updates.reservationId;

    const invoice = await Invoice.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Record Payment ───────────────────────────────────────────────────────
exports.recordPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amountPaid, paymentMethod, notes } = req.body;

    if (!amountPaid || amountPaid <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required',
      });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    // Check if invoice is already fully paid
    if (invoice.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Invoice is already fully paid',
      });
    }

    // Update payment details
    invoice.amountPaid += amountPaid;
    if (paymentMethod) {
      invoice.paymentMethod = paymentMethod;
    }
    if (notes) {
      invoice.notes = notes;
    }

    // Ensure amountPaid doesn't exceed total
    if (invoice.amountPaid > invoice.totalAmount) {
      invoice.amountPaid = invoice.totalAmount;
    }

    await invoice.save();

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: {
        invoiceId: invoice._id,
        totalAmount: invoice.totalAmount,
        amountPaid: invoice.amountPaid,
        balanceDue: invoice.balanceDue,
        paymentStatus: invoice.paymentStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Invoice ───────────────────────────────────────────────────────
exports.deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Payment Statistics ──────────────────────────────────────────────
exports.getPaymentStats = async (req, res, next) => {
  try {
    const stats = await Invoice.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$amountPaid' },
          totalBalance: { $sum: '$balanceDue' },
        },
      },
    ]);

    const totalStats = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalBilled: { $sum: '$totalAmount' },
          totalCollected: { $sum: '$amountPaid' },
          totalOutstanding: { $sum: '$balanceDue' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Payment statistics retrieved successfully',
      data: {
        byStatus: stats,
        overall: totalStats[0] || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

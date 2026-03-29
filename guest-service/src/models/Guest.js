const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    identityType: {
      type: String,
      enum: {
        values: ["passport", "national_id", "drivers_license", "other"],
        message:
          "Identity type must be one of: passport, national_id, drivers_license, other",
      },
      required: [true, "Identity type is required"],
    },
    identityNumber: {
      type: String,
      required: [true, "Identity number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "blocked"],
        message: "Status must be one of: active, inactive, blocked",
      },
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for common query patterns
guestSchema.index({ email: 1 });
guestSchema.index({ firstName: 1, lastName: 1 });
guestSchema.index({ status: 1 });
guestSchema.index({ identityNumber: 1 });

module.exports = mongoose.model("Guest", guestSchema);

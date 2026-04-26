const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    nic: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows multiple null values
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
    timestamps: true, // adds createdAt & updatedAt automatically
    versionKey: false,
  }
);

// Indexes for frequently queried fields
guestSchema.index({ email: 1 });
guestSchema.index({ nic: 1 });
guestSchema.index({ name: "text" }); // text index for name search

module.exports = mongoose.model("Guest", guestSchema);

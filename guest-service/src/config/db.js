const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB guest_db
 * Uses the MONGO_URI environment variable (falls back to local)
 */
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/guest_db";

    const conn = await mongoose.connect(mongoURI);
    console.log(
      `📦 MongoDB connected: ${conn.connection.host} / ${conn.connection.name}`
    );
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;

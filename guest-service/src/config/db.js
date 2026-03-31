const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB guest_db
 * Uses the MONGO_URI environment variable (falls back to local)
 */
const connectDB = async () => {
  try {
    const mongoURI =
<<<<<<< HEAD
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/guest_db";

    const conn = await mongoose.connect(mongoURI);

=======
      process.env.MONGODB_URI || "mongodb://localhost:27017/guest_db";
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
>>>>>>> 63742a2956c5ac92dbe80b3c186c95e1b6fd0589
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

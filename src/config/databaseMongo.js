const mongoose = require("mongoose");
require("dotenv").config();

async function connectMongo() {
  const mongoUri = process.env.MONGO_URI;
  mongoose.connection.on("connected", () => {});

  mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("[MongoDB] Reconnected");
  });
  try {
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error("[databaseMongo.js] MongoDB connection failed:", err.message);
    throw err;
  }
}

module.exports = { connectMongo, mongooseConnection: mongoose.connection };

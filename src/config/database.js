require("dotenv").config();
const path = require("path");
const sequelize = require("./sequelize");
const { connectMongo } = require("./databaseMongo");
const { connectRabbit } = require("./rabbit");
const { notificationConsumer } = require("../messaging/notification.consumer");
const RETRY_LIMIT = 10;
const RETRY_INTERVAL_MS = 5000;

async function initializeDatabase() {
  let retries = 0;
  while (retries < RETRY_LIMIT) {
    try {
      await sequelize.authenticate();
      break;
    } catch (error) {
      console.error(
        `[database.js] Mysql: Database connection failed (attempt ${
          retries + 1
        }/${RETRY_LIMIT}):`,
        error.message
      );
      retries++;
      if (retries >= RETRY_LIMIT) {
        console.error(
          "[database.js] Mysql: Maximum retry limit reached. Exiting..."
        );
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, RETRY_INTERVAL_MS));
    }
  }
  try {
    await connectMongo();
  } catch (err) {
    console.error("[database.js] MongoDB failed. Exiting... ", err.message );
    process.exit(1);
  }
}

module.exports = initializeDatabase;

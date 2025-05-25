const amqp = require("amqplib");
require("dotenv").config();

let connection = null;
let channel = null;

function buildRabbitMQUrl() {
  const {
    RABBITMQ_PROTOCOL,
    RABBITMQ_USER,
    RABBITMQ_PASSWORD,
    RABBITMQ_HOST,
    RABBITMQ_PORT,
    RABBITMQ_VHOST,
  } = process.env;

  const vhost = encodeURIComponent(RABBITMQ_VHOST || "/");
  return `${RABBITMQ_PROTOCOL}://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/${vhost}`;
}

async function connectRabbit() {
  if (channel) return channel;

  try {
    const url = buildRabbitMQUrl();
    connection = await amqp.connect(url);
    channel = await connection.createChannel();

    console.log("[RabbitMQ] Connected");
    return channel;
  } catch (error) {
    console.error("[RabbitMQ] Connection failed:", error.message);
    throw error;
  }
}

async function closeRabbit() {
  if (channel) await channel.close();
  if (connection) await connection.close();
  console.log("[RabbitMQ] Connection closed");
}

async function connectWithRetry(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await connectRabbit();
      console.log("Connected to RabbitMQ");
      return connection;
    } catch (err) {
      console.error("RabbitMQ connection failed. Retrying in 5s...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("RabbitMQ not reachable after retries");
}

module.exports = {
  connectRabbit,
  closeRabbit,
  connectWithRetry,
};

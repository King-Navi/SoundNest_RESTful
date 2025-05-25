const { connectRabbit } = require("../config/rabbit");
const { createNotification } = require("../service/notification.service");
const { getUserById } = require("../service/user.service");
const { validateNotification } = require("./utils/validateNotifications");

const QUEUE = "notifications-queue";

async function notificationConsumer() {
  const channel = await connectRabbit();
  await channel.assertQueue(QUEUE, { durable: true });

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const raw = parseMessage(msg);
    if (raw === null) return channel.nack(msg, false, false);

    const payload = validatePayload(raw);
    if (!payload) return channel.nack(msg, false, false);

    const enriched = await enrichPayload(payload);
    if (!enriched) return channel.nack(msg, false, false);

    try {
      await createNotification(enriched);

      if (process.env.ENVIROMENT === "development") {
        console.log("+DEBUG+ [Consumer] Notification created:", enriched);
      }
      channel.ack(msg);
    } catch (err) {
      console.error("[Consumer Error]", err);
      channel.nack(msg, false, false);
    }
  });
  console.log(`[Consumer] Listening on queue "${QUEUE}"`);
}

function parseMessage(msg) {
  try {
    return JSON.parse(msg.content.toString());
  } catch (err) {
    console.error("[Consumer] Invalid JSON", err);
    return null;
  }
}

function validatePayload(raw) {
  const { error, value } = validateNotification(raw);
  if (error) {
    console.error("[Validation Error]", error.details);
    return null;
  }
  return value;
}

async function enrichPayload(payload) {
  try {
    const user = await getUserById(payload.user_id);
    if (!user) throw new Error(`User ${payload.user_id} not found`);

    return {
      ...payload,
      user: user.nameUser,
    };
  } catch (err) {
    console.error(
      "[notification.consumer.js] enrichPayload :  user not found " +
        payload.user_id
    );
    return null;
  }
}

module.exports = { notificationConsumer };

const { connectRabbit } = require("../config/rabbit");

const QUEUE = "song.delete";

/**
 * Publishes a message indicating that a song should be deleted.
 * @param {number} idSong - The ID of the song to delete.
 * @returns {Promise<void>}
 */
async function publishDeleteSong(idSong) {
  if (!idSong || typeof idSong !== "number") {
    throw new Error("publishDeleteSong expects a valid numeric idSong");
  }

  const channel = await connectRabbit();

  await channel.assertQueue(QUEUE, { durable: true });

  const message = Buffer.from(JSON.stringify({ idSong }));

  channel.sendToQueue(QUEUE, message, {
    persistent: true,
  });

  console.log("[Producer] Sent deleteSong message:", { idSong });
}

module.exports = { publishDeleteSong };

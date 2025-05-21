const { connectRabbit } = require('../../config/rabbit');

const SONG_VISITS_QUEUE = process.env.SONG_VISITS_QUEUE_NAME;
/**
 * Sends a notification about a song’s visit count.
 *
 * @param {Object} params
 * @param {string} params.userId      - ID of the song’s owner.
 * @param {string} params.userName    - Name of the song’s owner.
 * @param {string} params.songId      - ID of the song.
 * @param {string} params.songName    - Name of the song.
 * @param {number} params.visitCount  - Number of visits the song has.
 */
async function alertUsersOfEventSongVisits({
  userId,
  userName,
  songId,
  songName,
  visitCount
}) {
  console.log(`Se envio ${{
    userId,
    userName,
    songId,
    songName,
    visitCount
  }}`)
  const channel = await connectRabbit();

  const payload = {
    userId,
    userName,
    songId,
    songName,
    visitCount,
    timestamp: new Date().toISOString()
  };

  
  await channel.assertQueue(SONG_VISITS_QUEUE, { durable: true });
  channel.sendToQueue(SONG_VISITS_QUEUE, Buffer.from(JSON.stringify(payload)), {
    persistent: true
  });
}

module.exports = { alertUsersOfEventSongVisits };

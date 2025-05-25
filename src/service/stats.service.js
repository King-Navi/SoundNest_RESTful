const {
  getTotalPlaysByUser,
  getMostPlayedSongByUser,
} = require("../repositories/stats.repository");

/**
 * Fetches and flattens song statistics for a given user.
 *
 * @param {number} userId
 * @returns {Promise<{ totalPlays: number, topSongName: string|null, playCount: number }>}
 */
async function getUserSongStats(userId) {
  const [totalPlays, topSong] = await Promise.all([
    getTotalPlaysByUser(userId),
    getMostPlayedSongByUser(userId),
  ]);

  return {
    totalPlays,
    topSongName: topSong ? topSong.songName : null,
    playCount: topSong ? topSong.playCount : 0,
  };
}

module.exports = {
  getUserSongStats,
};

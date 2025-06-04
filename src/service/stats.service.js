const {
  getTotalPlaysByUser,
  getMostPlayedSongByUser,
  getTopSongsByUser,
  getTopGlobalSongs,
  getTopGlobalGenres,
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

async function getTopSongsByUserService(userId, limit) {
  if (!userId || !limit) {
    throw new Error("User ID and limit are required");
  }
  return await getTopSongsByUser(userId, limit);
}

async function getTopGlobalSongsService(limit) {
  if (!limit) {
    throw new Error("Limit is required");
  }
  return await getTopGlobalSongs(limit);
}

async function getTopGlobalGenresService(limit) {
  if (!limit) {
    throw new Error("Limit is required");
  }
  return await getTopGlobalGenres(limit);
}

module.exports = {
  getUserSongStats,
  getTopSongsByUserService,
  getTopGlobalSongsService,
  getTopGlobalGenresService
};

const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { Visualization, Song } = initModels(sequelize);

/**
 * Returns the total play count across all songs of a given user.
 * @param {number} userId
 * @returns {Promise<number>}
 */
async function getTotalPlaysByUser(userId) {
  const result = await Visualization.findOne({
    attributes: [
      [sequelize.fn("SUM", sequelize.col("playCount")), "totalPlays"],
    ],
    include: {
      model: Song,
      as: "idSong_Song",
      where: { idAppUser: userId },
      attributes: [],
    },
    raw: true,
  });
  return parseInt(result.totalPlays, 10) || 0;
}

/**
 * Returns the most played song (name and its play count) for a given user.
 * @param {number} userId
 * @returns {Promise<{ songName: string, playCount: number } | null>}
 */
async function getMostPlayedSongByUser(userId) {
  const rows = await Visualization.findAll({
    attributes: [
      "idSong",
      [sequelize.fn("SUM", sequelize.col("playCount")), "playCount"],
    ],
    include: {
      model: Song,
      as: "idSong_Song",
      where: { idAppUser: userId },
      attributes: ["songName"],
    },
    group: ["idSong", "idSong_Song.songName"],
    order: [[sequelize.fn("SUM", sequelize.col("playCount")), "DESC"]],
    limit: 1,
    raw: true,
  });

  if (!rows.length) {
    return null;
  }

  return {
    songName: rows[0]["idSong_Song.songName"],
    playCount: parseInt(rows[0].playCount, 10),
  };
}

/**
 * Combines total plays and top song into a single object.
 * @param {number} userId
 * @returns {Promise<{ totalPlays: number, topSong: { songName: string, playCount: number } | null }>}
 */
async function getUserSongStats(userId) {
  const [totalPlays, topSong] = await Promise.all([
    getTotalPlaysByUser(userId),
    getMostPlayedSongByUser(userId),
  ]);

  return { totalPlays, topSong };
}

module.exports = {
  getTotalPlaysByUser,
  getMostPlayedSongByUser,
  getUserSongStats,
};

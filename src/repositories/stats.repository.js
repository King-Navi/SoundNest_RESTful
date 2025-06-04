const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { Visualization, Song } = initModels(sequelize);
const { QueryTypes } = require('sequelize');
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

/**
 * Retrieves the N most listened songs by a specific user.
 * @param {number} userId - The ID of the user.
 * @param {number} limit - The number of songs to return.
 * @returns {Promise<Array<{songName: string, totalPlayCount: number}>>} An array of objects with songName and totalPlayCount.
 * @throws {Error} If there's an issue fetching the data.
 */
async function getTopSongsByUser(userId, limit) {
    try {
        const [results] = await sequelize.query(
            'CALL GetTopSongsByUser(:idUser, :pLimit)',
            {
                replacements: { idUser: userId, pLimit: limit },
                type: QueryTypes.RAW
            }
        );
        return results;
    } catch (error) {
        console.error('Error fetching top N songs by user:', error);
        throw error;
    }
}

/**
 * Retrieves the N most listened songs globally.
 * @param {number} limit - The number of songs to return.
 * @returns {Promise<Array<{songName: string, totalPlayCount: number}>>} An array of objects with songName and totalPlayCount.
 * @throws {Error} If there's an issue fetching the data.
 */
async function getTopGlobalSongs(limit) {
    try {
        const [results] = await sequelize.query(
            'CALL GetTopGlobalSongs(:pLimit)',
            {
                replacements: { pLimit: limit },
                type: QueryTypes.RAW
            }
        );
        return results;
    } catch (error) {
        console.error('Error fetching top N global songs:', error);
        throw error;
    }
}

/**
 * Retrieves the N most listened genres globally.
 * @param {number} limit - The number of genres to return.
 * @returns {Promise<Array<{genreName: string, totalPlayCount: number}>>} An array of objects with genreName and totalPlayCount.
 * @throws {Error} If there's an issue fetching the data.
 */
async function getTopGlobalGenres(limit) {
    try {
        const [results] = await sequelize.query(
            'CALL GetTopNGlobalGenres(:pLimit)',
            {
                replacements: { pLimit: limit },
                type: QueryTypes.RAW
            }
        );
        return results;
    } catch (error) {
        console.error('Error fetching top N global genres:', error);
        throw error;
    }
}


module.exports = {
  getTotalPlaysByUser,
  getMostPlayedSongByUser,
  getUserSongStats,
  getTopSongsByUser,
  getTopGlobalSongs,
  getTopGlobalGenres
};

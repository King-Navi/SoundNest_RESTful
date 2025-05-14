const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { Op, fn, col, literal } = require("sequelize");
const {MAX_SONGS_RECOVER} = require("../repositories/song.repository")
const models = initModels(sequelize);
const { Visualization } = models;
const MAX_POPULAR_SONGS = 60;
/**
 * Returns the top song IDs by total playCount in a given month/year.
 *
 * @param {number} [year]  Four-digit year (defaults to current year)
 * @param {number} [month] Month number 1–12 (defaults to current month)
 * @param {number} [limit=10] How many song IDs to return (max 60)
 * @returns {Promise<number[]>} Array of idSong sorted by descending plays
 */
async function getTopSongIdsByMonth(year, month, limit = MAX_SONGS_RECOVER) {
  const now = new Date();
  const y = year && !isNaN(year) ? Number(year) : now.getFullYear();
  const m =
    month && !isNaN(month) && month >= 1 && month <= 12
      ? Number(month)
      : now.getMonth() + 1;
  const safeLimit = Math.min(limit, MAX_POPULAR_SONGS);

  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 1);
  const rows = await Visualization.findAll({
    where: {
      period: { [Op.gte]: startDate, [Op.lt]: endDate },
    },
    attributes: ["idSong", [fn("SUM", col("playCount")), "totalPlays"]],
    group: ["idSong"],
    order: [[literal("totalPlays"), "DESC"]],
    limit: safeLimit,
    raw: true,
  });
  return rows.map((r) => r.idSong);
}

/**
 * Retrieves all visualization records for a given song ID.
 *
 * @param {number} idSong - The ID of the song to search visualizations for.
 * @returns {Promise<Array>} A list of matching visualization records.
 */
async function getVisualizationsBySongId(idSong) {
  if (!idSong || isNaN(Number(idSong))) {
    throw new Error("Invalid or missing song ID");
  }

  return await Visualization.findAll({
    where: {
      idSong: idSong,
    },
    order: [["period", "ASC"]],
  });
}

module.exports = {
  getVisualizationsBySongId,
  getTopSongIdsByMonth,
};

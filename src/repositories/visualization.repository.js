const { Op, fn, col, literal, where } = require("sequelize");
const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { MAX_SONGS_RECOVER } = require("./song.repository");

const MAX_POPULAR_SONGS = 60;
const models = initModels(sequelize);
const { Visualization } = models;

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
  const parsedLimit = Number(limit);
  const safeLimit = isNaN(parsedLimit)
    ? MAX_SONGS_RECOVER
    : Math.min(parsedLimit, MAX_POPULAR_SONGS);

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

/**
 * Creates a new view (play) record.
 * @param {number} playCount - Number of plays
 * @param {string} period - Period date in 'YYYY-MM-DD' format
 * @param {number} idSong - Song ID
 */
async function create(playCount, period, idSong) {
  if (playCount == null || !period || idSong == null) {
    throw new Error("Missing parameters in create()");
  }

  return await Visualization.create({
    playCount,
    period,
    idSong,
  });
}

/**
 * Checks if a play record exists for a song in a given month and year.
 * @param {number} idSong - Song ID
 * @param {number} month - Month (1–12)
 * @param {number} year - Year (YYYY)
 * @returns {Promise<boolean>}
 */
async function existsByIdAndPeriodMonthYear(idSong, month, year) {
  if (!idSong || !month || !year) {
    throw new Error("Missing parameters in existsByIdAndPeriodMonthYear()");
  }

  const [result] = await sequelize.query(
    `
    SELECT 1
    FROM Visualization
    WHERE idSong = ?
      AND MONTH(period) = ?
      AND YEAR(period) = ?
    LIMIT 1
    `,
    {
      replacements: [idSong, month, year],
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return !!result;
}

/**
 * Increments the play count by 1 for a specific visualization record.
 * @param {number} idVisualization - ID of the record in the Visualization table
 * @returns {Promise<boolean>} true if updated, false if not found
 */
async function incrementPlayCountById(idVisualization) {
  if (!idVisualization || !Number.isInteger(idVisualization)) {
    throw new Error("Invalid idVisualization in incrementPlayCountById()");
  }

  const [affectedRows] = await Visualization.update(
    { playCount: sequelize.literal("playCount + 1") },
    { where: { idVisualizations: idVisualization } }
  );

  return affectedRows > 0;
}

/**
 * Retrieves a visualization by idSong, month, and year from the `period` field.
 * @param {number} idSong
 * @param {number} month - Month (1–12)
 * @param {number} year - Year (e.g., 2025)
 * @returns {Promise<Object|null>}
 */
async function getBySongAndPeriodMonthYear(idSong, month, year) {
  if (!idSong || !month || !year) {
    throw new Error("Missing parameters in getBySongAndPeriodMonthYear()");
  }

  return await Visualization.findOne({
    where: {
      idSong,
      [Op.and]: [
        where(fn("MONTH", col("period")), month),
        where(fn("YEAR", col("period")), year),
      ],
    },
  });
}

module.exports = {
  getTopSongIdsByMonth,
  getVisualizationsBySongId,
  create,
  existsByIdAndPeriodMonthYear,
  incrementPlayCountById,
  getBySongAndPeriodMonthYear,
};

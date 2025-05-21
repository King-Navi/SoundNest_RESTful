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
  console.log("Si llego aqui")
  const now = new Date();
  const y = year && !isNaN(year) ? Number(year) : now.getFullYear();
  const m =
    month && !isNaN(month) && month >= 1 && month <= 12
      ? Number(month)
      : now.getMonth() + 1;
  const parsedLimit = Number(limit);
  const safeLimit = isNaN(parsedLimit) ? MAX_SONGS_RECOVER : Math.min(parsedLimit, MAX_POPULAR_SONGS);

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
 * Crea un nuevo registro de visualización
 * @param {number} playCount - Número de reproducciones
 * @param {string} period - Fecha del periodo en formato 'YYYY-MM-DD'
 * @param {number} idSong - ID de la canción
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
 * Verifica si existe una visualización para una canción en un mes y año dados
 * @param {number} idSong - ID de la canción
 * @param {number} month - Mes (1-12)
 * @param {number} year - Año (YYYY)
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
 * Incrementa en 1 el contador de reproducciones para una visualización específica
 * @param {number} idVisualization - ID del registro en la tabla Visualization
 * @returns {Promise<boolean>} true si se actualizó, false si no se encontró
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
 * Recupera una visualización por idSong, mes y año del campo `period`
 * @param {number} idSong
 * @param {number} month - Mes (1-12)
 * @param {number} year - Año (ej. 2025)
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
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");
const { format } = require("date-fns");
const {NonexistentVisualization} = require("./exceptions/exceptions")
const visualizationRepo = require("../repositories/visualization.repository");

/**
 * Increases the play count for a song during the current month.
 * 
 * This function uses the 'America/Mexico_City' timezone to determine
 * the current month and year. If a visualization record already exists
 * for the given song and the current month, it increments its play count by 1.
 * Otherwise, it creates a new record with playCount set to 1.
 * 
 * @param {number} idSong - The ID of the song whose play count should be incremented.
 * @returns {Promise<void>} Resolves when the operation completes.
 * 
 * @throws {Error} If idSong is invalid or missing.
 * 
 * @example
 * // Assuming it's May 2025 and no record exists:
 * await increasePlayCountForSong(42);
 * // → Creates: { idSong: 42, playCount: 1, period: '2025-05-01' }
 * 
 * // Calling again in the same month:
 * await increasePlayCountForSong(42);
 * // → Updates existing visualization: playCount becomes 2
 */
async function increasePlayCountForSong(idSong) {
  if (!idSong || isNaN(Number(idSong))) {
    throw new Error("Invalid idSong in increasePlayCountForSong()");
  }
  const now = getCurrentTimeInMexico();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const existing = await visualizationRepo.getBySongAndPeriodMonthYear(idSong, month, year);

  if (existing) {
    await visualizationRepo.incrementPlayCountById(existing.idVisualizations);
  } else {
    const period = format(now, "yyyy-MM-01");
    await visualizationRepo.create(1, period, idSong);
  }
}


async function getVisualizationBySongAndPeriod(idSong, month, year) {
  const result = await visualizationRepo.getBySongAndPeriodMonthYear(idSong, month, year);
  if (!result) {
    throw new NonexistentVisualization(`No visualization found for song ${idSong} in ${month}/${year}`);
  }
  return result;
}

/**
 * Retrieves all visualizations for a given song.
 * @returns {Promise<Array>} Empty array if none found.
 */
async function getVisualizationsForSong(idSong) {
  return await visualizationRepo.getVisualizationsBySongId(idSong);
}
/**
 * Retrieves the top song IDs by play count for a specific month/year.
 * @returns {Promise<number[]>} Array of song IDs (can be empty).
 */
async function getTopSongsByPeriod(year, month, limit) {
  return await visualizationRepo.getTopSongIdsByMonth(year, month, limit);
}

function getCurrentTimeInMexico() {
  const date = new Date();
  const offset = -6;
  date.setHours(date.getHours() + offset);
  return date;
}

module.exports = {
  increasePlayCountForSong,
  getVisualizationBySongAndPeriod,
  getVisualizationsForSong,
  getTopSongsByPeriod,
};

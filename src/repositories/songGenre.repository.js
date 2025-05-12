const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { SongGenre } = initModels(sequelize);
const { Sequelize, Op } = require("sequelize");
const NoChangesError = require("./exceptions/noChangesError");

/**
 * This function queries the `SongGenre` table and returns all genres,
 * including their ID (`idSongGenre`) and name (`genreName`), ordered alphabetically by name.
 * The results are returned as plain JavaScript objects.
 *
 * @async
 * @function getAllGenres
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of genre objects.
 * Each object has the shape: { idSongGenre: number, genreName: string | null }
 * @throws Will throw an error if the database query fails.
 */
async function getAllGenres() {
  try {
    const genres = await SongGenre.findAll({
      attributes: ["idSongGenre", "genreName"],
      order: [["genreName", "ASC"]],
      raw: true,
    });
    return genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
}

module.exports = {
  getAllGenres,
};

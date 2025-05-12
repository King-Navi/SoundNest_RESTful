const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { SongExtension } = initModels(sequelize);
const { Sequelize, Op } = require("sequelize");
const NoChangesError = require("./exceptions/noChangesError");
const { raw } = require("mysql2");

/**
 * This function queries the `SongExtension` table and returns all available extensions,
 * including their ID (`idSongExtension`) and name (`extensionName`), ordered alphabetically by name.
 * The results are returned as plain JavaScript objects.
 *
 * @async
 * @function getAllExtension
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of extension objects.
 * Each object has the shape: { idSongExtension: number, extensionName: string }
 * @throws Will throw an error if the database query fails.
 */
async function getAllExtension() {
  try {
    const extensions = await SongExtension.findAll({
      attributes: ["idSongExtension", "extensionName"],
      order: [["extensionName", "ASC"]],
      raw: true,
    });
    return extensions;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllExtension,
};

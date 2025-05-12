const { getAllGenres } = require("../repositories/songGenre.repository");
const { getAllExtension } = require("../repositories/songExtension.repository");

async function getGenres() {
  try {
    return await getAllGenres();
  } catch (error) {
    throw error;
  }
}

async function getExtensions() {
  try {
    return await getAllExtension();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getGenres,
  getExtensions,
};

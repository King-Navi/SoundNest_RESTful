const { getGenres, getExtensions } = require("../service/song.service");

/**
 * Express handler to return all song genres as JSON.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getGenresController(req, res) {
  try {
    const genres = await getGenres();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genres." });
  }
}
/**
 * Express handler to return all file extensions as JSON.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getExtensionsController(req, res) {
  try {
    const extensions = await getExtensions();
    res.status(200).json(extensions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch extensions." });
  }
}

module.exports = { getGenresController,getExtensionsController  };

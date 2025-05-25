const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { SongPhoto } = initModels(sequelize);

/*
Manual inserts due to Sequelize error with the field name `createAt`
*/

/**
 * Creates a new song image without using `updatedAt`.
 * @param {string} fileName - File name (e.g., song-12.jpg)
 * @param {string} extension - File extension without the dot (e.g., jpg)
 * @param {number} idSong - Song ID
 */
async function create(fileName, extension, idSong) {
  if (!fileName || !extension || !idSong) {
    throw new Error("Missing parameters in create()");
  }

  return await sequelize.query(
    `
    INSERT INTO SongPhoto (fileName, extension, idSong, createdAt)
    VALUES (?, ?, ?, NOW())
    `,
    {
      replacements: [fileName, extension.toLowerCase(), idSong],
      type: sequelize.QueryTypes.INSERT,
    }
  );
}

/**
 * Updates the file name and extension of an existing song image.
 * @param {number} idSongPhoto - ID of the image
 * @param {string} fileName - New file name
 * @param {string} extension - New file extension (without the dot)
 */
async function update(idSongPhoto, fileName, extension) {
  if (!idSongPhoto || !fileName || !extension) {
    throw new Error("Missing parameters in update()");
  }

  return await sequelize.query(
    `
    UPDATE SongPhoto
    SET fileName = ?, extension = ?
    WHERE idSongPhoto = ?
    `,
    {
      replacements: [fileName, extension.toLowerCase(), idSongPhoto],
      type: sequelize.QueryTypes.UPDATE,
    }
  );
}

/**
 * Retrieves a song photo by its song ID.
 * @param {number} idSong - Song ID
 * @returns {Promise<Object|null>} The photo object, or null if not found.
 */
async function getBySongPhotoId(idSong) {
  const [result] = await sequelize.query(
    `
    SELECT idSongPhoto, fileName, extension, createdAt, idSong
    FROM SongPhoto
    WHERE idSong = ?
    LIMIT 1
    `,
    {
      replacements: [idSong],
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return result || null;
}

async function deleteSongPhotoBySongId(idSong) {
  return await SongPhoto.destroy({ where: { idSong } });
}

module.exports = {
  create,
  update,
  getBySongPhotoId,
  deleteSongPhotoBySongId,
};

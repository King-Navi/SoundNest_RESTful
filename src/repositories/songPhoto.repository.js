const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { SongPhoto } = initModels(sequelize);

/*
manual inserts because error of sequelizer with the name of createAt
*/

/**
 * Crea una nueva imagen de canción sin usar `updatedAt`
 * @param {string} fileName - Nombre del archivo (ej: song-12.jpg)
 * @param {string} extension - Extensión sin punto (ej: jpg)
 * @param {number} idSong - ID de la canción
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
 * Actualiza el nombre y extensión de una imagen existente.
 * @param {number} idSongPhoto - ID de la imagen
 * @param {string} fileName - Nuevo nombre de archivo
 * @param {string} extension - Nueva extensión (sin punto)
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
 * Obtiene una foto por idSong
 * @param {number} idSong - ID de la canción
 * @returns {Promise<Object|null>}
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

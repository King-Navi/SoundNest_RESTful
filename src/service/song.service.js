const { getAllGenres } = require("../repositories/songGenre.repository");
const { getAllExtension } = require("../repositories/songExtension.repository");
const FileManager = require("../utils/fileManager");
const fileManager = new FileManager();
const {
  getSongsByFilters,
  verifySongExists,
  getRecentSongs,
  getRandomSongs,
  getMostViewedSongs,
  getMostViewedSongsThisMonth,
  getSongsByIds,
  getSongById,
  getSongsByUserId,
  getMostRecentSongByUser,
  updateSongSetDeleted,
} = require("../repositories/song.repository");
const {
  getVisualizationsBySongId,
  getTopSongIdsByMonth,
} = require("../repositories/visualization.repository");
const { getBySongPhotoId, deleteSongPhotoBySongId} = require("../repositories/songPhoto.repository");
const { NotFoundError } = require("../repositories/exceptions/song.exceptions");
const SongDescriptionRepository = require("../repositories/songDescription.mongo.reposiroty");
const songDescriptionRepo = new SongDescriptionRepository();


/**
 * Deletes all files associated with a song and its related photo.
 * 
 * - Marks the song as logically deleted by setting its `isDeleted` flag to `true`.
 * - Deletes the song's description if it exists.
 * - Deletes the associated photo both from storage and the database.
 * - Sends a gRPC request to remove the audio file remotely.
 * 
 * This function does **not** delete any visualization linked to the song.
 * 
 * @param {string} idSong - The unique identifier of the song to delete.
 * @returns {Promise<Object>} A message confirming the song was successfully deleted.
 * @throws {Error} If the song does not exist, or if any step in the deletion process fails.
 */
async function deleteSongService(idSong) {
  const song = await getSongById(idSong);
  if (!song) {
    throw new Error(`The song with ID ${idSong} does not exist`);
  }

  const desc = await songDescriptionRepo.getBySongId(idSong);
  if (desc) {
    try {
      await songDescriptionRepo.deleteBySongId(idSong);
    } catch (err) {
      throw new Error(`Error deleting description for song ${idSong}`);
    }
  }
  const photo = await getBySongPhotoId(idSong);
  if (photo) {
    const { fileName, extension } = photo;
    await fileManager.deleteImage(fileName, extension);
    await deleteSongPhotoBySongId(idSong);
  }

  const audioDeleted = await fileManager.requestRemoteDeleteSong(idSong);
  if (!audioDeleted) {
    throw new Error(`No se pudo eliminar el audio de la canción ${idSong}`);
  }

  await updateSongSetDeleted(idSong);
  
  return { message: `Canción ${idSong} eliminada correctamente` };
}



async function searchSong(songName, artistName, idGenre, limitSearch, offsetSearch) {
  try {
    const filters = {
      songName,
      artistName,
      idSongGenre: idGenre
    };
    pagination = {
      limit : limitSearch,
      offset : offsetSearch,
    }
    let queryResult= await getSongsByFilters(filters);
    return await formatSongList(queryResult);
  } catch (error) {
    throw error;
  }
}

/**
 * Returns the most popular songs for a month/year.
 *   - Si no hay visualizaciones en ese mes, devuelve [].
 *   - Formatea las canciones igual que getRecent o getRandom.
 *
 * @param {number|string} [year]   Four-digit year (defaults to current year)
 * @param {number|string} [month]  Month number 1–12 (defaults to current month)
 * @param {number|string} [limit=10]  How many songs to return (max 60)
 * @returns {Promise<Array>} Formatted song object list
 */
async function getMostPopular(year, month, limit = 10) {
  try {
    const now = new Date();
    const y = year && !isNaN(Number(year)) ? Number(year) : now.getFullYear();
    const m =
      month && !isNaN(Number(month)) && month >= 1 && month <= 12
        ? Number(month)
        : now.getMonth() + 1;
    const safeLimit = Math.min(Number(limit) || 10, 60);
    const topIds = await getTopSongIdsByMonth(y, m, safeLimit);
    if (topIds.length === 0) {
      return [];
    }

    const songs = await getSongsByIds(topIds);
    const songMap = new Map(songs.map((s) => [s.idSong, s]));
    const orderedSongs = topIds.map((id) => songMap.get(id)).filter(Boolean);

    return await formatSongList(orderedSongs);
  } catch (error) {
    throw error;
  }
}

async function getRecent(number) {
  try {
    let queryResult;
    if (number > 0) {
      queryResult = await getRecentSongs(number);
    } else {
      queryResult = await getRecentSongs();
    }
    return await formatSongList(queryResult);
  } catch (error) {
    throw error;
  }
}

async function getRandom(amount) {
  try {
    const songs = await getRandomSongs(amount);
    if (!songs || songs.length === 0) {
      throw new NotFoundError("No songs found");
    }

    return await formatSongList(songs);
  } catch (error) {
    throw error;
  }
}

async function getSong(idSong) {
  try {
    const song = await getSongById(idSong);

    if (!song) {
      throw new Error(`Song with id ${idSong} not found`);
    }

    return await formatSong(song);
  } catch (error) {
    throw error;
  }
}

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

async function getSongOfUser(userId) {
  try {
    const rawSongs = await getSongsByUserId(userId);
    return formatSongList(rawSongs); 
  } catch (error) {
    throw error;
  }
}

async function getLastUserSong(userId) {
  const song = await getMostRecentSongByUser(userId);
  if (!song) return null;

  return await formatSong(song);
}

/**
 * Converts a raw song instance to a structured JSON response
 * with visualizations and mapped fields.
 *
 * @param {Object} song Sequelize instance
 * @returns {Promise<Object>} formatted song object
 */
async function formatSong(song) {
  if (!song) return null;

  const songData = song.toJSON();
  const visualizations = await getVisualizationsBySongId(songData.idSong);
  const photo = await getBySongPhotoId(songData.idSong);
  const pathImageUrl = photo
    ? `/images/songs/${photo.fileName}.${photo.extension}`
    : null;

  let description = "N/A";
  try {
    const descDoc = await songDescriptionRepo.getBySongId(songData.idSong);
    if (descDoc && descDoc.description) {
      description = descDoc.description;
    }
  } catch (error) { }
  return {
    idSong: songData.idSong,
    songName: songData.songName,
    fileName: songData.fileName,
    durationSeconds: songData.durationSeconds,
    releaseDate: songData.releaseDate,
    isDeleted: songData.isDeleted,
    idSongGenre: songData.idSongGenre,
    idSongExtension: songData.idSongExtension,
    userName: songData.idAppUser_AppUser?.nameUser || null,
    description,
    pathImageUrl,
    visualizations,
  };
}

/**
 * Maps a list of songs to formatted output
 *
 * @param {Array<Object>} songs List of Sequelize instances
 * @returns {Promise<Array<Object>>}
 */
async function formatSongList(songs) {
  const results = await Promise.all(songs.map(formatSong));
  return results;
}



module.exports = {
  getSong,
  getGenres,
  getExtensions,
  getRandom,
  getRecent,
  getMostPopular,
  searchSong,
  getSongOfUser,
  getLastUserSong,
  deleteSongService,
};

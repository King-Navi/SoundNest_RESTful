const { getAllGenres } = require("../repositories/songGenre.repository");
const { getAllExtension } = require("../repositories/songExtension.repository");

const {
  getSongsByFilters,
  verifySongExists,
  getRecentSongs,
  getRandomSongs,
  getMostViewedSongs,
  getMostViewedSongsThisMonth,
  getSongsByIds,
  getSongById,
} = require("../repositories/song.repository");
const {
  getVisualizationsBySongId,
  getTopSongIdsByMonth,
} = require("../repositories/visualization.repository");
const { NotFoundError } = require("../repositories/exceptions/song.exceptions");


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
    description: null, // TODO: Populate if needed
    pathImageUrl: null, // TODO: Populate if needed
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
};

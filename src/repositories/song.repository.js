const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { Op, fn, col, literal } = require("sequelize");
const models = initModels(sequelize);
const { Song, Visualization, AppUser, SongPhoto } = models;
const {NotFoundError} = require("./exceptions/song.exceptions")

const MAX_SONGS_RECOVER = 40;


async function getByIdWithDetails(idSong) {
  return await Song.findByPk(idSong, {
    include: [
      {
        model: AppUser,
        as: "idAppUser_AppUser",
        attributes: ["nameUser"],
      },
      {
        model: SongPhoto,
        as: "SongPhotos",
        attributes: ["fileName", "extension"],
      },
      {
        model: Visualization,
        as: "Visualizations",
        attributes: ["playCount", "period"],
      },
    ],
  });
}


/**
 * Retrieves a list of songs based on optional filters and pagination.
 * At least one of the following filters must be provided: songName, artistName, idSongGenre.
 *
 * - Filters songs by name using a LIKE pattern.
 * - Filters songs by genre ID.
 * - Filters songs by artist name using a LIKE pattern.
 * - Only returns songs that are not marked as deleted.
 * - Supports pagination using limit and offset.
 *
 * @param {Object} filters - Filters to apply to the song query.
 * @param {string} [filters.songName] - Partial or full song name to search for.
 * @param {string} [filters.artistName] - Partial or full artist name to search for.
 * @param {number} [filters.idSongGenre] - ID of the song genre to filter by.
 *
 * @param {Object} [pagination={}] - Pagination parameters.
 * @param {number} [pagination.limit=10] - Maximum number of results to return (max 50).
 * @param {number} [pagination.offset=0] - Number of results to skip (for paging).
 *
 * @returns {Promise<Array>} A list of matching song records including genre and artist info.
 * @throws {Error} If no filters are provided or if the query fails.
 */
async function getSongsByFilters(filters, pagination = {}) {
  const { songName, artistName, idSongGenre } = filters || {};
  const { limit = 10, offset = 0 } = pagination;

  if (!songName && !artistName && !idSongGenre) {
    throw new Error(
      "At least one filter (songName, artistName, idSongGenre) must be provided."
    );
  }

  const safeLimit = Math.min(limit, 50);
  const safeOffset = Math.max(offset, 0);

  const where = { isDeleted: false };

  if (songName) {
    where.songName = { [Op.like]: `%${songName}%` };
  }

  if (idSongGenre) {
    where.idSongGenre = idSongGenre;
  }

  const include = [];

  if (artistName) {
    include.push({
      model: Song.sequelize.models.AppUser,
      as: "idAppUser_AppUser",
      where: {
        nameUser: { [Op.like]: `%${artistName}%` },
      },
      attributes: ["idUser", "nameUser"],
    });
  } else {
    include.push({
      model: Song.sequelize.models.AppUser,
      as: "idAppUser_AppUser",
      attributes: ["idUser", "nameUser"],
    });
  }

  include.push({
    model: Song.sequelize.models.SongGenre,
    as: "idSongGenre_SongGenre",
    attributes: ["idSongGenre", "genreName"],
  });

  try {
    const songs = await Song.findAll({
      where,
      include,
      order: [["songName", "ASC"]],
      limit: safeLimit,
      offset: safeOffset,
    });

    return songs;
  } catch (error) {
    console.error("Error fetching songs with filters:", error);
    throw error;
  }
}

async function verifySongExists(songId) {
  const song = await Song.findByPk(songId);

  if (!song) {
    throw new NotFoundError(`Song with id ${songId} was not found.`);
  }

  if (song.isDeleted) {
    throw new DeletedError(
      `Song with id ${songId} has been marked as deleted.`
    );
  }

  return song;
}
async function getRecentSongs(limit = 10) {
  const safeLimit = Math.min(limit, MAX_SONGS_RECOVER);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const songs = await Song.findAll({
    where: {
      isDeleted: false,
      releaseDate: {
        [Op.gte]: oneWeekAgo,
      },
    },
    order: [["releaseDate", "DESC"]],
    limit: safeLimit,
  });

  return songs;
}
async function getRandomSongs(limit = 10) {
  const safeLimit = Math.min(limit, 60);

  return await Song.findAll({
    where: {
      isDeleted: false,
    },
    order: [literal("RAND()")],
    limit: safeLimit,
  });
}
async function getMostViewedSongs(limit = 10) {
  const safeLimit = Math.min(limit, 60);

  return await Song.findAll({
    where: { isDeleted: false },
    include: [
      {
        model: Visualization,
        as: "Visualizations",
        attributes: [],
      },
    ],
    attributes: {
      include: [[fn("SUM", col("Visualizations.playCount")), "totalViews"]],
    },
    group: ["Song.idSong"],
    order: [[literal("totalViews"), "DESC"]],
    limit: safeLimit,
  });
}
async function getMostViewedSongsThisMonth(year, month, limit = MAX_SONGS_RECOVER) {
  const safeLimit = Math.min(limit, 60);
  const now = new Date();

  const targetYear = year && !isNaN(year) ? Number(year) : now.getFullYear();
  const targetMonth = month && !isNaN(month) && month >= 1 && month <= 12
    ? Number(month)
    : now.getMonth() + 1;

  const startDate = new Date(targetYear, targetMonth - 1, 1);
  const endDate = new Date(targetYear, targetMonth, 1);

  try{
    return await Song.findAll({
      subQuery: false,
      where: { isDeleted: false },
      include: [
        {
          model: Visualization,
          as: "Visualizations",
          attributes: [],
          required: true,
          where: {
            period: {
              [Op.gte]: startDate,
              [Op.lt]: endDate,
            },
          },
        },
      ],
      attributes: {
        include: [
          [ fn('SUM', col('Visualizations.playCount')), 'monthlyViews' ]
        ],
      },
      group: ["Song.idSong"],
      having: literal("monthlyViews IS NOT NULL"),
      order: [[literal("monthlyViews"), "DESC"]],
      limit: safeLimit,
    });
  }catch(error){
    console.error(error)
  }
}
async function getSongsByIds(songIds) {
  if (!Array.isArray(songIds) || songIds.length === 0) {
    return [];
  }

  const songs = await Song.findAll({
    where: {
      idSong: {
        [Op.in]: songIds,
      },
      isDeleted: false,
    },
  });

  return songs;
}
async function getSongById(id) {
  if (!id || isNaN(Number(id))) {
    throw new NotFoundError("Invalid or missing song ID");
  }
  const song = await Song.findOne({
    where: {
      idSong: id,
      isDeleted: false,
    },
    include: [
      {
        model: AppUser,
        as: "idAppUser_AppUser",
        attributes: ["nameUser"]
      }
    ]
  });

  return song;
}

/**
 * Retrieves all non-deleted songs for a specific user.
 *
 * @param {number} userId - ID of the AppUser
 * @returns {Promise<Array>} List of Song instances
 */
async function getSongsByUserId(userId) {
  if (!userId || isNaN(userId)) {
    throw new Error("Invalid user ID");
  }

  const songs = await Song.findAll({
    where: {
      idAppUser: userId,
      isDeleted: false
    },
    order: [["releaseDate", "DESC"]]
  });

  return songs;
}

/**
 * Retrieves the most recently released (non-deleted) song by a specific user.
 *
 * @param {number} userId - ID of the AppUser
 * @returns {Promise<Object|null>} The most recent Song instance or null if not found
 */
async function getMostRecentSongByUser(userId) {
  if (!userId || isNaN(userId)) {
    throw new Error("Invalid user ID");
  }

  const song = await Song.findOne({
    where: {
      idAppUser: userId,
      isDeleted: false
    },
    order: [["releaseDate", "DESC"]]
  });

  return song;
}
async function updateSongSetDeleted(idSong) {
  return await Song.update({ isDeleted: true }, { where: { idSong } });
}

module.exports = {
  MAX_SONGS_RECOVER,
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
  getByIdWithDetails
};
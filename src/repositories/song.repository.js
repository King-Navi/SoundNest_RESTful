const sequelize = require("../config/sequelize");
const initModels = require("../models/init-models");
const { Song, AppUser, SongGenre } = initModels(sequelize);
const { Sequelize, Op } = require("sequelize");
const NoChangesError = require("./exceptions/noChangesError");

class SongRepository{
  /**
   * Retrieves songs based on optional filters: name, artist, genre.
   *
   * @param {Object} filters - Object with optional keys: songName, artistName, idSongGenre.
   * @returns {Promise<Array>} List of matching songs with genre and artist info.
   */
  async getSongsByFilters(filters) {
    const where = {};

    if (filters.songName) {
      where.songName = { [Op.like]: `%${filters.songName}%` };
    }

    if (filters.idSongGenre) {
      where.idSongGenre = filters.idSongGenre;
    }

    const include = [];

    if (filters.artistName) {
      include.push({
        model: AppUser,
        as: "idAppUser_AppUser",
        where: {
          nameUser: { [Op.like]: `%${filters.artistName}%` }
        },
        attributes: ['idUser', 'nameUser']
      });
    } else {
      include.push({
        model: AppUser,
        as: "idAppUser_AppUser",
        attributes: ['idUser', 'nameUser']
      });
    }

    include.push({
      model: SongGenre,
      as: "idSongGenre_SongGenre",
      attributes: ['idSongGenre', 'genreName']
    });

    try {
      const songs = await Song.findAll({
        where,
        include,
        order: [['songName', 'ASC']]
      });
      return songs;
    } catch (error) {
      console.error("Error fetching songs with filters:", error);
      throw error;
    }
  }

  async songExists(idSong) {
    const song = await Song.findByPk(idSong);
    return !!song;
  }
}

module.exports = SongRepository
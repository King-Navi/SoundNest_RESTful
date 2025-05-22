const { SongDescription } = require('../modelsMongo/songDescription');

class SongDescriptionRepository {
  async create(data) {
    const newDescription = new SongDescription(data);
    return await newDescription.save();
  }

  async getBySongId(songs_id) {
    return await SongDescription.findOne({ songs_id });
  }

  /**
   * Updates only the 'description' field for the given song.
   *
   * @param {number} songs_id       – ID de la canción a la que pertenece la descripción.
   * @param {string} newDescription – La nueva descripción.
   * @returns {Promise<Object|null>} – El documento actualizado, o null si no existía.
   */
  async updateDescriptionBySongId(songs_id, newDescription) {
    return await SongDescription.findOneAndUpdate(
      { songs_id },
      { $set: { description: newDescription } },
      { new: true }
    );
  }

  async deleteBySongId(songs_id) {
    return await SongDescription.findOneAndDelete({ songs_id });
  }
}

module.exports = SongDescriptionRepository;

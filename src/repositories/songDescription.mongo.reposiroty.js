const { SongDescription } = require('../modelsMongo/songDescription');

class SongDescriptionRepository {
  async create(data) {
    const newDescription = new SongDescription(data);
    return await newDescription.save();
  }

  async getBySongId(songs_id) {
    return await SongDescription.findOne({ songs_id });
  }

  async updateBySongId(songs_id, updatedData) {
    return await SongDescription.findOneAndUpdate(
      { songs_id },
      { $set: updatedData },
      { new: true }
    );
  }

  async deleteBySongId(songs_id) {
    return await SongDescription.findOneAndDelete({ songs_id });
  }
}

module.exports = SongDescriptionRepository;

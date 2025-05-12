const initModels = require("../models/init-models");
const { SongPhoto } = initModels(sequelize);

const SongPhotoService = {
  create: async (data) => {
    return await SongPhoto.create(data);
  },

  getById: async (idSongPhoto) => {
    return await SongPhoto.findByPk(idSongPhoto);
  },

  getAll: async () => {
    return await SongPhoto.findAll();
  },

  update: async (idSongPhoto, data) => {
    const photo = await SongPhoto.findByPk(idSongPhoto);
    if (!photo) return null;
    return await photo.update(data);
  },

  delete: async (idSongPhoto) => {
    const photo = await SongPhoto.findByPk(idSongPhoto);
    if (!photo) return null;
    await photo.destroy();
    return true;
  },

  getFileNamesByIds: async (ids) => {
    const photos = await SongPhoto.findAll({
      where: {
        idSongPhoto: ids
      },
      attributes: ['idSongPhoto', 'fileName']
    });
    return photos.map(photo => ({
      idSongPhoto: photo.idSongPhoto,
      fileName: photo.fileName
    }));
  }
};

module.exports = SongPhotoService;

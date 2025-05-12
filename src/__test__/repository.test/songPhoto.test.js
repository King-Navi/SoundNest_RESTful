// const { Sequelize } = require('sequelize');
// const initModels = require('../models/init-models');
// const connection = require('../../config/sequelize');
// let sequelize;
// let models;
// let SongService;
// let SongPhotoService;

// beforeAll(async () => {
//   sequelize = connection

//   models = initModels(sequelize);
//   SongPhotoService = require('../../repositories');
//   SongService = require('../../repositories/');

//   await sequelize.authenticate();
// });

// afterAll(async () => {
//   await sequelize.close();
// });

// describe('SongPhotoService Integration Tests', () => {
//   let createdSong;
//   let createdPhoto;

//   test('Crear una canción de prueba', async () => {
//     createdSong = await models.Song.create({
//       title: 'Canción Test',
//       idAppUser: 1
//     });

//     expect(createdSong).toHaveProperty('idSong');
//   });

//   test('Crear SongPhoto asociado a canción', async () => {
//     createdPhoto = await SongPhotoService.create({
//       fileName: 'test_photo.jpg',
//       extension: 'jpg',
//       idSong: createdSong.idSong
//     });

//     expect(createdPhoto).toHaveProperty('idPhoto');
//     expect(createdPhoto.fileName).toBe('test_photo.jpg');
//   });

//   test('getFileNamesByIds debe devolver el fileName', async () => {
//     const result = await SongPhotoService.getFileNamesByIds([createdPhoto.idPhoto]);

//     expect(Array.isArray(result)).toBe(true);
//     expect(result[0]).toHaveProperty('fileName', 'test_photo.jpg');
//   });

//   test('Eliminar SongPhoto y Canción', async () => {
//     const deleted = await SongPhotoService.delete(createdPhoto.idPhoto);
//     expect(deleted).toBe(true);

//     await createdSong.destroy(); // Limpieza manual
//   });
// });



  test('  TODO', async () => {
    expect(true).toBe(true);
  });


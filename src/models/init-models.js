var DataTypes = require("sequelize").DataTypes;
var _AppUser = require("./AppUser");
var _Photo = require("./Photo");
var _Role = require("./Role");
var _Song = require("./Song");
var _SongExtension = require("./SongExtension");
var _SongGenre = require("./SongGenre");
var _SongPhoto = require("./SongPhoto");
var _Visualization = require("./Visualization");

function initModels(sequelize) {
  var AppUser = _AppUser(sequelize, DataTypes);
  var Photo = _Photo(sequelize, DataTypes);
  var Role = _Role(sequelize, DataTypes);
  var Song = _Song(sequelize, DataTypes);
  var SongExtension = _SongExtension(sequelize, DataTypes);
  var SongGenre = _SongGenre(sequelize, DataTypes);
  var SongPhoto = _SongPhoto(sequelize, DataTypes);
  var Visualization = _Visualization(sequelize, DataTypes);

  Photo.belongsTo(AppUser, { as: "idUser_AppUser", foreignKey: "idUser"});
  AppUser.hasMany(Photo, { as: "Photos", foreignKey: "idUser"});
  Song.belongsTo(AppUser, { as: "idAppUser_AppUser", foreignKey: "idAppUser"});
  AppUser.hasMany(Song, { as: "Songs", foreignKey: "idAppUser"});
  AppUser.belongsTo(Role, { as: "idRole_Role", foreignKey: "idRole"});
  Role.hasMany(AppUser, { as: "AppUsers", foreignKey: "idRole"});
  SongPhoto.belongsTo(Song, { as: "idSong_Song", foreignKey: "idSong"});
  Song.hasMany(SongPhoto, { as: "SongPhotos", foreignKey: "idSong"});
  Visualization.belongsTo(Song, { as: "idSong_Song", foreignKey: "idSong"});
  Song.hasMany(Visualization, { as: "Visualizations", foreignKey: "idSong"});
  Song.belongsTo(SongExtension, { as: "idSongExtension_SongExtension", foreignKey: "idSongExtension"});
  SongExtension.hasMany(Song, { as: "Songs", foreignKey: "idSongExtension"});
  Song.belongsTo(SongGenre, { as: "idSongGenre_SongGenre", foreignKey: "idSongGenre"});
  SongGenre.hasMany(Song, { as: "Songs", foreignKey: "idSongGenre"});

  return {
    AppUser,
    Photo,
    Role,
    Song,
    SongExtension,
    SongGenre,
    SongPhoto,
    Visualization,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

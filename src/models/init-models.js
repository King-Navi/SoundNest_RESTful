var DataTypes = require("sequelize").DataTypes;
var _AppUser = require("./AppUser");
var _Role = require("./Role");
var _Song = require("./Song");
var _SongGenre = require("./SongGenre");
var _Visualization = require("./Visualization");

function initModels(sequelize) {
  var AppUser = _AppUser(sequelize, DataTypes);
  var Role = _Role(sequelize, DataTypes);
  var Song = _Song(sequelize, DataTypes);
  var SongGenre = _SongGenre(sequelize, DataTypes);
  var Visualization = _Visualization(sequelize, DataTypes);

  Song.belongsTo(AppUser, { as: "idAppUser_AppUser", foreignKey: "idAppUser"});
  AppUser.hasMany(Song, { as: "Songs", foreignKey: "idAppUser"});
  AppUser.belongsTo(Role, { as: "idRole_Role", foreignKey: "idRole"});
  Role.hasMany(AppUser, { as: "AppUsers", foreignKey: "idRole"});
  Visualization.belongsTo(Song, { as: "idSong_Song", foreignKey: "idSong"});
  Song.hasMany(Visualization, { as: "Visualizations", foreignKey: "idSong"});
  Song.belongsTo(SongGenre, { as: "idSongGenre_SongGenre", foreignKey: "idSongGenre"});
  SongGenre.hasMany(Song, { as: "Songs", foreignKey: "idSongGenre"});

  return {
    AppUser,
    Role,
    Song,
    SongGenre,
    Visualization,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

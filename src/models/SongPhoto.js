const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SongPhoto', {
    idSongPhoto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fileName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "fileName"
    },
    extension: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    idSong: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Song',
        key: 'idSong'
      }
    }
  }, {
    sequelize,
    tableName: 'SongPhoto',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idSongPhoto" },
        ]
      },
      {
        name: "fileName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fileName" },
        ]
      },
      {
        name: "idSong",
        using: "BTREE",
        fields: [
          { name: "idSong" },
        ]
      },
    ]
  });
};

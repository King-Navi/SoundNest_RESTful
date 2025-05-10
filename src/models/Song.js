const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Song', {
    idSong: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    songName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    durationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    idSongGenre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SongGenre',
        key: 'idSongGenre'
      }
    },
    idAppUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AppUser',
        key: 'idUser'
      }
    }
  }, {
    sequelize,
    tableName: 'Song',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idSong" },
        ]
      },
      {
        name: "idSongGenre",
        using: "BTREE",
        fields: [
          { name: "idSongGenre" },
        ]
      },
      {
        name: "idAppUser",
        using: "BTREE",
        fields: [
          { name: "idAppUser" },
        ]
      },
    ]
  });
};

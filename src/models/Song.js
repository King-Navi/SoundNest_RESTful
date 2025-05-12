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
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "fileName"
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
    idSongExtension: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SongExtension',
        key: 'idSongExtension'
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
        name: "fileName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fileName" },
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
        name: "idSongExtension",
        using: "BTREE",
        fields: [
          { name: "idSongExtension" },
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

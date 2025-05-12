const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SongExtension', {
    idSongExtension: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    extensionName: {
      type: DataTypes.STRING(70),
      allowNull: false,
      unique: "extensionName"
    }
  }, {
    sequelize,
    tableName: 'SongExtension',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idSongExtension" },
        ]
      },
      {
        name: "extensionName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "extensionName" },
        ]
      },
    ]
  });
};

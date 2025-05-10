const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Visualization', {
    idVisualizations: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    playCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    period: {
      type: DataTypes.DATEONLY,
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
    tableName: 'Visualization',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idVisualizations" },
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

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Photo', {
    idPhoto: {
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
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AppUser',
        key: 'idUser'
      }
    }
  }, {
    sequelize,
    tableName: 'Photo',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idPhoto" },
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
        name: "idUser",
        using: "BTREE",
        fields: [
          { name: "idUser" },
        ]
      },
    ]
  });
};

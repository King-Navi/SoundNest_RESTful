const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Role', {
    idRole: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roleName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "roleName"
    }
  }, {
    sequelize,
    tableName: 'Role',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idRole" },
        ]
      },
      {
        name: "roleName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "roleName" },
        ]
      },
    ]
  });
};

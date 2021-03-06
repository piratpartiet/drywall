'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Message', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'message'
  });
};
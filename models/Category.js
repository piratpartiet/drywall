'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Category', {
    name: {
      type: DataTypes.STRING
    },
    pivot: {
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'category'
  });
};
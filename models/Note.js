'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Note', {
    data: {
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'note'
  });
};
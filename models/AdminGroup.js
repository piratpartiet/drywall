'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AdminGroup', {
    name: {
      type: DataTypes.STRING
    },
    permissions: {
      type: DataTypes.JSON
    }
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'admin_group'
  });
};
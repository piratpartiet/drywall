'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Member', {
    isVerified: {
      type: DataTypes.STRING
    },
    memberNumber: {
      type: DataTypes.INTEGER,
      field: 'member_number'
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name'
    },
    address: {
      type: DataTypes.STRING
    },
    zip: {
      type: DataTypes.INTEGER
    },
    phone: {
      type: DataTypes.STRING
    },
    yearBirth: {
      type: DataTypes.INTEGER,
      field: 'year_birth'
    },
    dateBirth: {
      type: DataTypes.DATEONLY,
      field: 'date_birth'
    },
    electable: {
      type: DataTypes.INTEGER
    },
    mailable: {
      type: DataTypes.INTEGER
    },
    memberSince: {
      type: DataTypes.DATE,
      field: 'member_since'
    }
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'member'
  });
};
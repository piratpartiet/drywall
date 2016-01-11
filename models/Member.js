'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Member', {
    isVerified: {
      type: DataTypes.STRING,
      field: 'is_verified'
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
    municipality: {
      type: DataTypes.STRING
    },
    county: {
      type: DataTypes.STRING
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
    },
    lastMembershipFeePaid: {
      type: DataTypes.DATE,
      field: 'last_membership_fee_paid'
    }
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'member'
  });
};

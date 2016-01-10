'use strict';

/*
Se også README

(belongs to users - specified in index.js)

Examples:

Piratpartiets admiral:
{ role_title: 'leder', role_pretty_title: 'admiral', group_title: 'Sentralstyret', group_type: 0 }

Styremedlem i Oslo piratparti:
{ role_title: 'styremedlem', group_title: 'Oslo', group_type: 30 }

etc.

role_title og group_title kunne muligens med fordel være foreign keys inn i andre tabeller.  Hm!

*/

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RoleAssignment', {
    roleTitle: {
      type: DataTypes.STRING,
      attribute: 'role_title'
    },
    rolePrettyTitle: {
      type: DataTypes.STRING,
      attribute: 'role_pretty_title'
    }
    groupTitle: {
      type: DataTypes.STRING,
      attribute: 'group_title'
    },
    groupType: {
      type: DataTypes.INTEGER,
      attribute: 'group_type'
    }
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'role_assignment'
  });
};

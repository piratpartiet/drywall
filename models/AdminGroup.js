'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('admin_group', {
        name: {
            type: DataTypes.STRING
        },
        permissions: {
            type: DataTypes.JSON
        }
    }, {
        freezeTableName: true
    });
};


'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('status_log', {
        name: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });
};



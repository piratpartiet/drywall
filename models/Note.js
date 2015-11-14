'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('note', {
        data: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });
};


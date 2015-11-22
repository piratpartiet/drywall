'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('StatusLog', {
        name: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: false,
        underscored: true,
        timestamps: true
    });
};



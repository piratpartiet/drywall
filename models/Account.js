/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('account', {
        isVerified: {
            type: DataTypes.STRING
        },
        member_number: {
            type: DataTypes.INT
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        : {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });
};


/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Payment', {
        paymentDate: {
            type: DataTypes.DATEONLY,
            field: 'payment_date'
        },
	NOKAmount: {
	    type: DataTypes.INTEGER,
            field: 'nok_amount'
	},
        actualAmount: {
            type: DataTypes.INTEGER,
            field: 'actual_amount'
        },
        currency: DataTypes.STRING,
        purpose: DataTypes.INTEGER,
        receipientAddress: {
            type: DataTypes.STRING,
            field: 'receipient_address'
        },
        txid: DataTypes.STRING 
    }, {
        freezeTableName: false,
        underscored: true,
        timestamps: true
    });
};


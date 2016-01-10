/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Payment', {
    paymentDate: {
      type: DataTypes.DATEONLY,
      field: 'payment_date'
    },
    AmountBC: {
      type: DataTypes.INTEGER,
      field: 'amount_bc'
    },
    AmountRC: {
      type: DataTypes.INTEGER,
      field: 'amount_rc'
    },
    currency: DataTypes.STRING,
    purpose: DataTypes.INTEGER,
    paymentAddress: {
      type: DataTypes.STRING,
      field: 'payment_address'
    },
    paymentConnection: {
      type: DataTypes.STRING,
      field: 'receipient_connection'
    }
    txid: DataTypes.STRING,
    payment_status: DataTypes.INTEGER
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'payment'
  });
};

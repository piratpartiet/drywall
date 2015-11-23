/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Member', {
        isVerified: {
            type: DataTypes.STRING
        },
        member_number: {
            type: DataTypes.INTEGER
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
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
	year_birth: {
	    type: DataTypes.INTEGER
	},
	date_birth: {
	    type: DataTypes.DATEONLY
	},
	electable: {
	    type: DataTypes.INTEGER
	},
	mailable: {
	    type: DataTypes.INTEGER
	},
	member_since: {
	    type: DataTypes.DATE
	},
	last_paid_subscription: {
	    type: DataTypes.DATE
	}
    }, {
        freezeTableName: false,
        underscored: true,
        timestamps: true,
        tablename: 'member'
    });
};

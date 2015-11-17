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
        email: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.INT
        }
        phone: {
            type: DataTypes.STRING
        },
	year_birth: {
	    type: DataTypes.INT
	},
	date_birth: {
	    type: DataTypes.STRING
	},
	electable: {
	    type: DataTypes.INT
	},
	mailable: {
	    type: DataTypes.INT
	},
	member_since: {
	    type: DataTypes.TIMESTAMP
	},
	last_paid_subscription: {
	    type: DataTypes.DATE
	}
    }, {
        freezeTableName: true
    });
};


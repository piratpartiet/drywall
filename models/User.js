var config = require('../config'),
    logging = require('../util/logging')(config);

'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    isActive: {
      type: DataTypes.STRING,
      field: 'is_active'
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      field: 'reset_password_token'
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      field: 'reset_password_expires'
    },
    twitter: DataTypes.JSON,
    github: DataTypes.JSON,
    facebook: DataTypes.JSON,
    google: DataTypes.JSON,
    tumblr: DataTypes.JSON
  }, {
    freezeTableName: false,
    underscored: true,
    timestamps: true,
    tableName: 'login_user',
    instanceMethods: {
      canPlayRoleOf: function(role) {
        return this.getRoleAssignments({
          where : { roleTitle : role }
        }).catch(function(err) {
          logging.error('User.canPlayRoleOf:', role, err);
        }).done(function(roles) {
          logging.debug('User.canPlayRoleOf:', role, roles);
          return roles.length > 0;
        });
      },
      defaultReturnUrl: function() {
        if (this.canPlayRoleOf('admin')) {
          return '/admin/';
        }

        return '/account/';
      }
    },
    classMethods: {
      encryptPassword: function(password, done) {
        var bcrypt = require('bcrypt');
        bcrypt.genSalt(10, function(err, salt) {
          if (err) {
            return done(err);
          }

          bcrypt.hash(password, salt, function(err, hash) {
            done(err, hash);
          });
        });
      },
      validatePassword: function(password, hash, done) {
        var bcrypt = require('bcrypt');
        bcrypt.compare(password, hash, function(err, res) {
          done(err, res);
        });
      }
    }
  });
};
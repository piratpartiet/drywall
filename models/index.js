'use strict';

var config = require('../config'),
  env = process.env.NODE_ENV || 'development',
  dbConfig = config.db[env],
  logging = require('../util/logging')(config),
  fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  basename = path.basename(module.filename),
  db = {};

// TODO: Figure out a more elegant way to do this. @asbjornu
dbConfig.logging = dbConfig.logging ? logging.debug : false;
var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.sync(dbConfig).then(function() {
  db.Message.belongsTo(db.User);
  db.Member.belongsTo(db.User);
  db.Payment.belongsTo(db.User);
  db.RoleAssignment.belongsTo(db.User);

  db.Member.sync(dbConfig);
  db.Message.sync(dbConfig);
  db.Payment.sync(dbConfig);
  db.RoleAssignment.sync(dbConfig);

  db.Admin.sync(dbConfig);
  db.AdminGroup.sync(dbConfig);
  db.Category.sync(dbConfig);
  db.LoginAttempt.sync(dbConfig);
  db.Note.sync(dbConfig);
  db.Status.sync(dbConfig);
  db.StatusLog.sync(dbConfig);
});

module.exports = db;
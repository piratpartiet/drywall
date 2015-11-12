'use strict';

var config = require('../config'),
    env = process.env.NODE_ENV || 'development',
    dbConfig = config.db[env],
    fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    basename = path.basename(module.filename),
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig),
    db = {};

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

var options = { force: dbConfig.force }

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.sync(options).then(function() {

    db.Message.belongsTo(db.User);
    db.Account.belongsTo(db.User);

    db.Account.sync(options);
    db.Message.sync(options);

    db.Admin.sync(options);
    db.AdminGroup.sync(options);
    db.Category.sync(options);
    db.LoginAttempt.sync(options);
    db.Note.sync(options);
    db.Status.sync(options);
    db.StatusLog.sync(options);

});

module.exports = db;
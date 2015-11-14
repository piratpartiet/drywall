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

db.user.sync(options).then(function() {

    db.message.belongsTo(db.user);
    db.account.belongsTo(db.user);

    db.account.sync(options);
    db.message.sync(options);

    db.admin.sync(options);
    db.admin_group.sync(options);
    db.category.sync(options);
    db.login_attempt.sync(options);
    db.note.sync(options);
    db.status.sync(options);
    db.status_log.sync(options);

});

module.exports = db;


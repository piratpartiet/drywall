"use strict";

let fs = require("fs");
let path = require("path");
let Sequelize = require("sequelize");
let basename = path.basename(module.filename);
let env = process.env.NODE_ENV || "development";
let config = require(__dirname + '/../config/config.json')[env];
let sequelize = new Sequelize(config.database, config.username, config.password, config);
let db = {};

console.log('Drywall aaa');

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== basename);
    })
    .forEach(function(file) {
        let model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

let options = {
    force: true
}

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


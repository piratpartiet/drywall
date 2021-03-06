'use strict';

//dependencies
var _ = require('underscore'),
    config = require('./config'),
    env = process.env.NODE_ENV || 'development',
    dbConfig = config.db[env],
    logging = require('./util/logging')(config),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    models = require('./models/index'),
    helmet = require('helmet'),
    csrf = require('csurf'),
    SequelizeStore = require('connect-session-sequelize')(session.Store),
    sequelizeStore = new SequelizeStore({ db: models.sequelize });

exports.setup = function(app) {
  //keep reference to config
  app.config = config;

  //setup the web server
  app.server = http.createServer(app);
  app.db = _.extend(models, {
    store: sequelizeStore
  });

  //settings
  app.disable('x-powered-by');
  app.set('port', config.port);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // middleware
  app.use(require('morgan')('dev'));
  app.use(require('compression')());
  app.use(require('serve-static')(path.join(__dirname, 'public')));
  app.use(require('method-override')());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(config.cryptoKey));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.cryptoKey,
    store: sequelizeStore,
    name: 'piratpartiet.sid',
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(csrf({ cookie: { signed: true } }));
  helmet(app);

  //response locals
  app.use(function(req, res, next) {
    res.cookie('_csrfToken', req.csrfToken());
    res.locals = res.locals ? res.locals : {};
    res.locals.user = {};
    res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
    res.locals.user.username = req.user && req.user.username;
    next();
  });

  // https://github.com/ethanl/connect-browser-logger
  // app.use(require('browser-logger')());

  //global locals
  app.locals.projectName = app.config.projectName;
  app.locals.copyrightYear = new Date().getFullYear();
  app.locals.copyrightName = app.config.companyName;
  app.locals.cacheBreaker = 'br34k-01';

  //setup passport
  require('./passport')(app, passport);

  //setup routes
  require('./routes')(app, passport);

  //custom (friendly) error handler
  // app.use(require('./views/http/index').http500);

  //setup utilities
  app.utility = _.extend(logging, {
    sendmail: require('./util/sendmail'),
    slugify: require('./util/slugify'),
    workflow: require('./util/workflow')
  });

  // TODO: Figure out a more elegant way to do this. @asbjornu
  dbConfig.logging = dbConfig.logging ? app.utility.debug : false;
  sequelizeStore.sync(dbConfig);

  return app;
};

// create express app
exports.app = this.setup(express());

// listen up
exports.app.server.listen(exports.app.config.port, function() {
  //and... we're live
  exports.app.utility.debug('Server is running on port ' + config.port);
});
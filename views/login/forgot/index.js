'use strict';

exports.init = function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect(req.user.defaultReturnUrl());
  } else {
    res.render('login/forgot/index');
  }
};

exports.send = function(req, res, next) {
  req.app.utility.debug('login.forgot.send:', req.body.email);

  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    req.app.utility.debug('login.forgot.workflow.validate:', req.body.email);

    if (!req.body.email) {
      req.app.utility.error('login.forgot.workflow.validate: Email required');
      workflow.outcome.errfor.email = 'required';
      return workflow.emit('response');
    }

    workflow.emit('generateToken');
  });

  workflow.on('generateToken', function() {
    req.app.utility.debug('login.forgot.workflow.generateToken');

    var crypto = require('crypto');
    crypto.randomBytes(21, function(err, buf) {
      if (err) {
        req.app.utility.error('login.forgot.workflow.generateToken.randomBytes', err);
        return next(err);
      }

      var token = buf.toString('hex');

      req.app.db.User.encryptPassword(token, function(err, hash) {
        req.app.utility.debug('login.forgot.workflow.generateToken.encryptPassword:', hash);

        if (err) {
          req.app.utility.error('login.forgot.workflow.generateToken.encryptPassword:', err);
          return next(err);
        }

        workflow.emit('patchUser', token, hash);
      });
    });
  });

  workflow.on('patchUser', function(token, hash) {
    var email = req.body.email.toLowerCase();

    req.app.utility.debug('login.forgot.workflow.patchUser:', token, hash, email);

    req.app.db.User
      .findOne({ where : { email: email } })
      .then(function(user) {
        req.app.utility.debug('login.forgot.workflow.patchUser.findOne:', email);

        if (user) {
          req.app.utility.debug('login.forgot.workflow.patchUser.findOne:', user);
          user.resetPasswordToken = hash;
          user.resetPasswordExpires = Date.now() + 10000000;
          user.save().then(function() {
            workflow.emit('sendEmail', token, user);
          });
        } else {
          req.app.utility.debug('login.forgot.workflow.patchUser.findOne: No user found!', email);
        }

        return workflow.emit('response');
      }).catch(function(err) {
        req.app.utility.error('login.forgot.workflow.patchUser:', err);
        return workflow.emit('exception', err);
      });
  });

  workflow.on('sendEmail', function(token, user) {
    req.app.utility.debug('login.forgot.workflow.sendEmail:', token, user);

    req.app.utility.sendmail(req, res, {
      from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
      to: user.email,
      subject: 'Reset your ' + req.app.config.projectName + ' password',
      textPath: 'login/forgot/email-text',
      htmlPath: 'login/forgot/email-html',
      locals: {
        username: user.username,
        resetLink: req.protocol + '://' + req.headers.host + '/login/reset/' + user.email + '/' + token + '/',
        projectName: req.app.config.projectName
      },
      success: function(message) {
        req.app.utility.debug('login.forgot.workflow.sendEmail.success:', message);
      },
      error: function(err) {
        req.app.utility.error('login.forgot.workflow.sendEmail.error:', err);
        workflow.outcome.errors.push('Error Sending: ' + err);
      }
    });
  });

  workflow.emit('validate');
};
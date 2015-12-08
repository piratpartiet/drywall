'use strict';

exports.init = function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect(req.user.defaultReturnUrl());
  }
  else {
    res.render('login/forgot/index');
  }
};

exports.send = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
      return workflow.emit('response');
    }

    workflow.emit('generateToken');
  });

  workflow.on('generateToken', function() {
    var crypto = require('crypto');
    crypto.randomBytes(21, function(err, buf) {
      if (err) {
        return next(err);
      }

      var token = buf.toString('hex');

      req.app.db.User.encryptPassword(token, function(err, hash) {
        if (err) {
          return next(err);
        }

        workflow.emit('patchUser', token, hash);
      });
    });
  });

  workflow.on('patchUser', function(token, hash) {
    var email = req.body.email.toLowerCase();

    req.app.utility.debug('Workflow.PatchUser:', token, hash, email);

    req.app.db.User
      .findOne({ where : { email: email } })
      .then(function(user) {
        if (user) {
          user.resetPasswordToken = hash;
          user.resetPasswordExpires = Date.now() + 10000000;
          user.save().then(function() {
            workflow.emit('sendEmail', token, user);
          });
        }

      return workflow.emit('response');
    }, function(err) {
      return workflow.emit('exception', err);
    });
  });

  workflow.on('sendEmail', function(token, user) {
    req.app.utility.sendmail(req, res, {
      from: req.app.config.smtp.from.name +' <'+ req.app.config.smtp.from.address +'>',
      to: user.email,
      subject: 'Reset your '+ req.app.config.projectName +' password',
      textPath: 'login/forgot/email-text',
      htmlPath: 'login/forgot/email-html',
      locals: {
        username: user.username,
        resetLink: req.protocol +'://'+ req.headers.host +'/logg-inn/reset/'+ user.email +'/'+ token +'/',
        projectName: req.app.config.projectName
      },
      success: function(message) {},
      error: function(err) {
        workflow.outcome.errors.push('Error Sending: '+ err);
      }
    });
  });

  workflow.emit('response');
};
'use strict';

exports.init = function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect(req.user.defaultReturnUrl());
  }
  else {
    res.render('login/reset/index');
  }
};

exports.set = function(req, res) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.password) {
      workflow.outcome.errfor.password = 'required';
    }

    if (!req.body.confirm) {
      workflow.outcome.errfor.confirm = 'required';
    }

    if (req.body.password !== req.body.confirm) {
      workflow.outcome.errors.push('Passwords do not match.');
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('findUser');
  });

  workflow.on('findUser', function() {
    var expires = new Date();
    var email = req.params.email;

    console.log('workflow.findUser:', email, expires);

    var conditions = {
        where : {
          email: email,
          resetPasswordExpires: { gt: expires }
        }
    };

    req.app.db.User.findOne(conditions).then(function(user) {
      if (!user) {
        workflow.outcome.errors.push('Invalid request.');
        return workflow.emit('response');
      }

      req.app.db.User.validatePassword(req.params.token, user.resetPasswordToken, function(err, isValid) {
        if (err) {
          return workflow.emit('exception', err);
        }

        if (!isValid) {
          workflow.outcome.errors.push('Invalid request.');
          return workflow.emit('response');
        }

        workflow.emit('patchUser', user);
      });
    }, function (err) {
        return workflow.emit('exception', err);
    });
  });

  workflow.on('patchUser', function(user) {
    console.log('workflow.patchUser:', user.dataValues.email);

    req.app.db.User.encryptPassword(req.body.password, function(err, hash) {
      if (err) {
        return workflow.emit('exception', err);
      }

      user.password = hash;
      user.resetPasswordToken = '';

      user.save().then(function() {
        console.log('login.reset.workflow.patchUser.save: Success!');
      }).catch(function(err) {
        console.log('login.reset.workflow.patchUser.save: Fail!');
        workflow.emit('exception', err);
      });

      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

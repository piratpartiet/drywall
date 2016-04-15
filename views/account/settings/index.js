'use strict';

var renderSettings = function(req, res, next, oauthMessage) {
  req.app.db.User.findById(req.user.id).then(function(user) {
    if (!user) {
      req.app.utility.debug('account.settings.renderSettings.findById: User not found');
      throw 'User not found';
    }

    user.getMember().then(function(member) {
      res.render('account/settings/index', {
        data: {
          member: escape(JSON.stringify(member)),
          user: escape(JSON.stringify(user))
        },
        oauthMessage: oauthMessage,
        oauthTwitter: !!req.app.config.oauth.twitter.key,
        oauthTwitterActive: user.twitter ? !!user.twitter.id : false,
        oauthGitHub: !!req.app.config.oauth.github.key,
        oauthGitHubActive: user.github ? !!user.github.id : false,
        oauthFacebook: !!req.app.config.oauth.facebook.key,
        oauthFacebookActive: user.facebook ? !!user.facebook.id : false,
        oauthGoogle: !!req.app.config.oauth.google.key,
        oauthGoogleActive: user.google ? !!user.google.id : false,
        oauthTumblr: !!req.app.config.oauth.tumblr.key,
        oauthTumblrActive: user.tumblr ? !!user.tumblr.id : false
      });
    }).catch(function(err) {
      req.app.utility.error('account.settings.renderSettings.user.getMember:', err);
      throw err;
    });
  })
  .catch(function(err) {
    req.app.utility.error('account.settings.renderSettings:', err);
    throw err;
  });
};

exports.init = function(req, res, next) {
  renderSettings(req, res, next, '');
};

exports.connectTwitter = function(req, res, next) {
  req._passport.instance.authenticate('twitter', function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/account/settings/');
    }

    req.app.db.User.findOne({
      where: {
        'twitter.id': info.profile.id,
        _id: {
          $ne: req.user.id
        }
      }
    }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Twitter account.');
      } else {
        req.app.db.User.findByIdAndUpdate(req.user.id, {
          'twitter.id': info.profile.id
        }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/account/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectGitHub = function(req, res, next) {
  req._passport.instance.authenticate('github', function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/account/settings/');
    }

    req.app.db.User.findOne({
      where: {
        'github.id': info.profile.id,
        _id: {
          $ne: req.user.id
        }
      }
    }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that GitHub account.');
      } else {
        req.app.db.User.findByIdAndUpdate(req.user.id, {
          'github.id': info.profile.id
        }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/account/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectFacebook = function(req, res, next) {
  req._passport.instance.authenticate('facebook', {
    callbackURL: '/account/settings/facebook/callback/'
  }, function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/account/settings/');
    }

    req.app.db.User.findOne({
      where: {
        'facebook.id': info.profile.id,
        _id: {
          $ne: req.user.id
        }
      }
    }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Facebook account.');
      } else {
        req.app.db.User.findByIdAndUpdate(req.user.id, {
          'facebook.id': info.profile.id
        }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/account/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectGoogle = function(req, res, next) {
  req._passport.instance.authenticate('google', {
    callbackURL: '/account/settings/google/callback/'
  }, function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/account/settings/');
    }

    req.app.db.User.findOne({
      where: {
        'google.id': info.profile.id,
        _id: {
          $ne: req.user.id
        }
      }
    }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Google account.');
      } else {
        req.app.db.User.findByIdAndUpdate(req.user.id, {
          'google.id': info.profile.id
        }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/account/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.connectTumblr = function(req, res, next) {
  req._passport.instance.authenticate('tumblr', {
    callbackURL: '/account/settings/tumblr/callback/'
  }, function(err, user, info) {
    if (!info || !info.profile) {
      return res.redirect('/account/settings/');
    }

    if (!info.profile.hasOwnProperty('id')) {
      info.profile.id = info.profile.username;
    }

    req.app.db.User.findOne({
      where: {
        'tumblr.id': info.profile.id,
        _id: {
          $ne: req.user.id
        }
      }
    }, function(err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        renderSettings(req, res, next, 'Another user has already connected with that Tumblr account.');
      } else {
        req.app.db.User.findByIdAndUpdate(req.user.id, {
          'tumblr.id': info.profile.id
        }, function(err, user) {
          if (err) {
            return next(err);
          }

          res.redirect('/account/settings/');
        });
      }
    });
  })(req, res, next);
};

exports.disconnectTwitter = function(req, res, next) {
  req.app.db.User.findByIdAndUpdate(req.user.id, {
    twitter: {
      id: undefined
    }
  }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/account/settings/');
  });
};

exports.disconnectGitHub = function(req, res, next) {
  req.app.db.User.findByIdAndUpdate(req.user.id, {
    github: {
      id: undefined
    }
  }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/account/settings/');
  });
};

exports.disconnectFacebook = function(req, res, next) {
  req.app.db.User.findByIdAndUpdate(req.user.id, {
    facebook: {
      id: undefined
    }
  }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/account/settings/');
  });
};

exports.disconnectGoogle = function(req, res, next) {
  req.app.db.User.findByIdAndUpdate(req.user.id, {
    google: {
      id: undefined
    }
  }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/account/settings/');
  });
};

exports.disconnectTumblr = function(req, res, next) {
  req.app.db.User.findByIdAndUpdate(req.user.id, {
    tumblr: {
      id: undefined
    }
  }, function(err, user) {
    if (err) {
      return next(err);
    }

    res.redirect('/account/settings/');
  });
};

exports.update = function(req, res, next) {
  req.app.utility.debug('account.settings.update');

  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    req.app.utility.debug('account.settings.update.validate');

    if (!req.body.firstName) {
      workflow.outcome.errfor.firstName = 'required';
    }

    if (!req.body.lastName) {
      workflow.outcome.errfor.lastName = 'required';
    }

    if (workflow.hasErrors()) {
      req.app.utility.debug('account.settings.update.validate: hasErrors');
      return workflow.emit('response');
    }

    workflow.emit('patchMember');
  });

  workflow.on('patchMember', function() {
    req.app.utility.debug('account.settings.update.patchMember');

    req.user.getMember().then(function(member) {
      if (!member) {
        req.app.utility.debug('account.settings.update.patchMember.user.getMember: Member not found. Creating.');
        req.user.createMember({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          middleName: req.body.middleName,
          company: req.body.company,
          phone: req.body.phone,
          zip: req.body.zip
        }).then(function(member) {
          req.app.utility.debug('account.settings.update.patchMember.user.createMember:', member);
          workflow.outcome.member = member;
          return workflow.emit('response');
        }).catch(function(err) {
          req.app.utility.error('account.settings.update.patchMember.user.createMember:', err);
          return workflow.emit('exception', err);
        });
      } else {
        member.firstName = req.body.firstName;
        member.lastName = req.body.lastName;
        member.middleName = req.body.middleName;
        member.company = req.body.company;
        member.phone = req.body.phone;
        member.zip = req.body.zip;

        member.save().then(function(member) {
          req.app.utility.debug('account.settings.update.patchMember.user.member.save:', member);
          workflow.outcome.member = member;
          return workflow.emit('response');
        }).catch(function(err) {
          req.app.utility.error('account.settings.update.patchMember.user.member.save:', err);
          return workflow.emit('exception', err);
        });
      }
    }).catch(function(err) {
      req.app.utility.error('account.settings.update.patchMember.user.getMember:', err);
      return workflow.emit('exception', err);
    });
  });

  return workflow.emit('validate');
};

exports.identity = function(req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.username) {
      workflow.outcome.errfor.username = 'required';
    } else if (!/^[a-zA-Z0-9\-\_]+$/.test(req.body.username)) {
      workflow.outcome.errfor.username = 'only use letters, numbers, \'-\', \'_\'';
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
    } else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = 'invalid email format';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('duplicateUsernameCheck');
  });

  workflow.on('duplicateUsernameCheck', function() {
    req.app.db.User.findOne({
      where: {
        username: req.body.username,
        id: {
          $ne: req.user.id
        }
      }
    }).then(function(user) {
      req.app.utility.debug('account.settings.identity.duplicateUsernameCheck.findOne:', user);

      if (user) {
        req.app.utility.error('account.settings.identity.duplicateUsernameCheck.findOne: Username already taken');
        workflow.outcome.errfor.username = 'username already taken';
        return workflow.emit('response');
      }

      workflow.emit('duplicateEmailCheck');
    }).catch(function(err) {
      req.app.utility.error('account.settings.identity.duplicateUsernameCheck.findOne:', err);
      return workflow.emit('exception', err);
    });
  });

  workflow.on('duplicateEmailCheck', function() {
    req.app.db.User.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        id: {
          $ne: req.user.id
        }
      }
    }).then(function(user) {
      req.app.utility.debug('account.settings.identity.duplicateEmailCheck.findOne:', user);

      if (user) {
        req.app.utility.error('account.settings.identity.duplicateEmailCheck.findOne: Email already taken');
        workflow.outcome.errfor.email = 'email already taken';
        return workflow.emit('response');
      }

      workflow.emit('patchUser');
    }).catch(function(err) {
      req.app.utility.error('account.settings.identity.duplicateEmailCheck.findOne:', err);
      return workflow.emit('exception', err);
    });
  });

  workflow.on('patchUser', function() {
    req.app.db.User.findById(req.user.id).then(function(user) {
      req.app.utility.debug('account.settings.identity.patchUser.findById:', user);

      user.username = req.body.username;
      user.email = req.body.email.toLowerCase();
      user.save().then(function(user) {
        req.app.utility.debug('account.settings.identity.patchUser.save:', user);
        workflow.emit('patchAdmin', user);
      }).catch(function(err) {
        req.app.utility.error('account.settings.identity.patchUser.save:', err);
        return workflow.emit('exception', err);
      });
    }).catch(function(err) {
      req.app.utility.error('account.settings.identity.patchUser.findById:', err);
      return workflow.emit('exception', err);
    });
  });

  workflow.on('patchAdmin', function(user) {
    req.app.utility.debug('account.settings.identity.patchAdmin:', user);

    if (user && user.canPlayRoleOf('admin')) {
      req.app.db.Admin.findById(user.id).then(function(admin) {
        // TODO: Does it make sense to set the admin's name to the user's username? @asbjornu
        admin.name = user.username;
        admin.save().then(function(admin) {
          req.app.utility.debug('account.settings.identity.patchAdmin.save:', admin);
        }).catch(function(err) {
          req.app.utility.error('account.settings.identity.patchAdmin.save:', err);
          workflow.emit('exception', err);
        });
      }).catch(function(err) {
        req.app.utility.error('account.settings.identity.patchAdmin.findById:', err);
        workflow.emit('exception', err);
      });
    }

    workflow.emit('patchMember', user);
  });

  workflow.on('patchMember', function(user) {
    // TODO: Do we need to patch the member when the identity changes? @asbjornu
    workflow.emit('populateRoles', user);
  });

  workflow.on('populateRoles', function(user) {
    // TODO: Do we need to populate the roles? @asbjornu
    workflow.outcome.user = user;
    workflow.emit('response');
  });

  workflow.emit('validate');
};

exports.password = function(req, res, next) {
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.newPassword) {
      workflow.outcome.errfor.newPassword = 'required';
    }

    if (!req.body.confirm) {
      workflow.outcome.errfor.confirm = 'required';
    }

    if (req.body.newPassword !== req.body.confirm) {
      workflow.outcome.errors.push('Passwords do not match.');
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('patchUser');
  });

  workflow.on('patchUser', function() {
    req.app.db.User.encryptPassword(req.body.newPassword, function(err, hash) {
      req.app.utility.debug('account.settings.password.patchUser.encryptPassword:', hash);

      if (err) {
        req.app.utility.error('account.settings.password.patchUser.encryptPassword:', err);
        return workflow.emit('exception', err);
      }

      req.app.db.User.findById(req.user.id).then(function(user) {
        req.app.utility.debug('account.settings.password.patchUser.findById:', user);
        user.password = hash;

        user.save().then(function(user) {
          req.app.utility.debug('account.settings.password.patchUser.save:', user);
          workflow.outcome.newPassword = '';
          workflow.outcome.confirm = '';
          return workflow.emit('response');
        }).catch(function(err) {
          req.app.utility.error('account.settings.password.patchUser.save:', err);
          return workflow.emit('exception', err);
        });
      }).catch(function(err) {
        req.app.utility.error('account.settings.password.patchUser.findById:', err);
        return workflow.emit('exception', err);
      });
    });
  });

  workflow.emit('validate');
};
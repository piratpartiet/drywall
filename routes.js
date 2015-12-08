'use strict';

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    req.app.utility.debug('routes.ensureAuthenticated: Authenticated');
    return next();
  }

  req.app.utility.debug('routes.ensureAuthenticated: Not authenticated');
  res.set('X-Auth-Required', 'true');

  if (req.session) {
    req.session.returnUrl = req.originalUrl;
  } else {
    req.app.utility.error('routes.ensureAuthenticated: No session!')
  }

  res.redirect('/logg-inn/');
}

function ensureAdmin(req, res, next) {
  if (req.user.canPlayRoleOf('admin')) {
    return next();
  }
  res.redirect('/');
}

function ensureAccount(req, res, next) {
  if (req.app.config.requireAccountVerification) {
    if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
      return res.redirect('/account/verification/');
    }
  }

  return next();
}

exports = module.exports = function(app, passport) {
  //front end
  app.get('/', require('./views/index').init);
  app.get('/about/', require('./views/about/index').init);
  app.get('/contact/', require('./views/contact/index').init);
  app.post('/contact/', require('./views/contact/index').sendMessage);

  //sign up
  app.get('/registrering/', require('./views/signup/index').init);
  app.post('/registrering/', require('./views/signup/index').signup);

  //social sign up
  app.post('/registrering/social/', require('./views/signup/index').signupSocial);
  app.get('/registrering/twitter/', passport.authenticate('twitter', { callbackURL: '/registrering/twitter/callback/' }));
  app.get('/registrering/twitter/callback/', require('./views/signup/index').signupTwitter);
  app.get('/registrering/github/', passport.authenticate('github', { callbackURL: '/registrering/github/callback/', scope: ['user:email'] }));
  app.get('/registrering/github/callback/', require('./views/signup/index').signupGitHub);
  app.get('/registrering/facebook/', passport.authenticate('facebook', { callbackURL: '/registrering/facebook/callback/', scope: ['email'] }));
  app.get('/registrering/facebook/callback/', require('./views/signup/index').signupFacebook);
  app.get('/registrering/google/', passport.authenticate('google', { callbackURL: '/registrering/google/callback/', scope: ['profile email'] }));
  app.get('/registrering/google/callback/', require('./views/signup/index').signupGoogle);
  app.get('/registrering/tumblr/', passport.authenticate('tumblr', { callbackURL: '/registrering/tumblr/callback/' }));
  app.get('/registrering/tumblr/callback/', require('./views/signup/index').signupTumblr);

  //logg-inn/out
  app.get('/logg-inn/', require('./views/login/index').init);
  app.post('/logg-inn/', require('./views/login/index').login);
  app.get('/logg-inn/forgot/', require('./views/login/forgot/index').init);
  app.post('/logg-inn/forgot/', require('./views/login/forgot/index').send);
  app.get('/logg-inn/reset/', require('./views/login/reset/index').init);
  app.get('/logg-inn/reset/:email/:token/', require('./views/login/reset/index').init);
  app.put('/logg-inn/reset/:email/:token/', require('./views/login/reset/index').set);
  app.get('/logout/', require('./views/logout/index').init);

  //social login
  app.get('/logg-inn/twitter/', passport.authenticate('twitter', { callbackURL: '/logg-inn/twitter/callback/' }));
  app.get('/logg-inn/twitter/callback/', require('./views/login/index').loginTwitter);
  app.get('/logg-inn/github/', passport.authenticate('github', { callbackURL: '/logg-inn/github/callback/' }));
  app.get('/logg-inn/github/callback/', require('./views/login/index').loginGitHub);
  app.get('/logg-inn/facebook/', passport.authenticate('facebook', { callbackURL: '/logg-inn/facebook/callback/' }));
  app.get('/logg-inn/facebook/callback/', require('./views/login/index').loginFacebook);
  app.get('/logg-inn/google/', passport.authenticate('google', { callbackURL: '/logg-inn/google/callback/', scope: ['profile email'] }));
  app.get('/logg-inn/google/callback/', require('./views/login/index').loginGoogle);
  app.get('/logg-inn/tumblr/', passport.authenticate('tumblr', { callbackURL: '/logg-inn/tumblr/callback/', scope: ['profile email'] }));
  app.get('/logg-inn/tumblr/callback/', require('./views/login/index').loginTumblr);

  //admin
  app.all('/admin*', ensureAuthenticated);
  app.all('/admin*', ensureAdmin);
  app.get('/admin/', require('./views/admin/index').init);

  //admin > users
  app.get('/admin/users/', require('./views/admin/users/index').find);
  app.post('/admin/users/', require('./views/admin/users/index').create);
  app.get('/admin/users/:id/', require('./views/admin/users/index').read);
  app.put('/admin/users/:id/', require('./views/admin/users/index').update);
  app.put('/admin/users/:id/password/', require('./views/admin/users/index').password);
  app.put('/admin/users/:id/role-admin/', require('./views/admin/users/index').linkAdmin);
  app.delete('/admin/users/:id/role-admin/', require('./views/admin/users/index').unlinkAdmin);
  app.put('/admin/users/:id/role-account/', require('./views/admin/users/index').linkAccount);
  app.delete('/admin/users/:id/role-account/', require('./views/admin/users/index').unlinkAccount);
  app.delete('/admin/users/:id/', require('./views/admin/users/index').delete);

  //admin > administrators
  app.get('/admin/administrators/', require('./views/admin/administrators/index').find);
  app.post('/admin/administrators/', require('./views/admin/administrators/index').create);
  app.get('/admin/administrators/:id/', require('./views/admin/administrators/index').read);
  app.put('/admin/administrators/:id/', require('./views/admin/administrators/index').update);
  app.put('/admin/administrators/:id/permissions/', require('./views/admin/administrators/index').permissions);
  app.put('/admin/administrators/:id/groups/', require('./views/admin/administrators/index').groups);
  app.put('/admin/administrators/:id/user/', require('./views/admin/administrators/index').linkUser);
  app.delete('/admin/administrators/:id/user/', require('./views/admin/administrators/index').unlinkUser);
  app.delete('/admin/administrators/:id/', require('./views/admin/administrators/index').delete);

  //admin > admin groups
  app.get('/admin/admin-groups/', require('./views/admin/admin-groups/index').find);
  app.post('/admin/admin-groups/', require('./views/admin/admin-groups/index').create);
  app.get('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').read);
  app.put('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').update);
  app.put('/admin/admin-groups/:id/permissions/', require('./views/admin/admin-groups/index').permissions);
  app.delete('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').delete);

  //admin > accounts
  app.get('/admin/konti/', require('./views/admin/accounts/index').find);
  app.post('/admin/konti/', require('./views/admin/accounts/index').create);
  app.get('/admin/konti/:id/', require('./views/admin/accounts/index').read);
  app.put('/admin/konti/:id/', require('./views/admin/accounts/index').update);
  app.put('/admin/konti/:id/user/', require('./views/admin/accounts/index').linkUser);
  app.delete('/admin/konti/:id/user/', require('./views/admin/accounts/index').unlinkUser);
  app.post('/admin/konti/:id/notes/', require('./views/admin/accounts/index').newNote);
  app.post('/admin/konti/:id/status/', require('./views/admin/accounts/index').newStatus);
  app.delete('/admin/konti/:id/', require('./views/admin/accounts/index').delete);

  //admin > statuses
  app.get('/admin/statuses/', require('./views/admin/statuses/index').find);
  app.post('/admin/statuses/', require('./views/admin/statuses/index').create);
  app.get('/admin/statuses/:id/', require('./views/admin/statuses/index').read);
  app.put('/admin/statuses/:id/', require('./views/admin/statuses/index').update);
  app.delete('/admin/statuses/:id/', require('./views/admin/statuses/index').delete);

  //admin > categories
  app.get('/admin/categories/', require('./views/admin/categories/index').find);
  app.post('/admin/categories/', require('./views/admin/categories/index').create);
  app.get('/admin/categories/:id/', require('./views/admin/categories/index').read);
  app.put('/admin/categories/:id/', require('./views/admin/categories/index').update);
  app.delete('/admin/categories/:id/', require('./views/admin/categories/index').delete);

  //admin > search
  app.get('/admin/search/', require('./views/admin/search/index').find);

  //konto
  app.all('/konto*', ensureAuthenticated);
  app.all('/konto*', ensureAccount);
  app.get('/konto/', require('./views/account/index').init);

  //konto > verification
  app.get('/konto/verifisering/', require('./views/account/verification/index').init);
  app.post('/konto/verifisering/', require('./views/account/verification/index').resendVerification);
  app.get('/konto/verifisering/:token/', require('./views/account/verification/index').verify);

  //konto > settings
  app.get('/konto/settings/', require('./views/account/settings/index').init);
  app.put('/konto/settings/', require('./views/account/settings/index').update);
  app.put('/konto/settings/identity/', require('./views/account/settings/index').identity);
  app.put('/konto/settings/password/', require('./views/account/settings/index').password);

  //konto > settings > social
  app.get('/konto/settings/twitter/', passport.authenticate('twitter', { callbackURL: '/konto/settings/twitter/callback/' }));
  app.get('/konto/settings/twitter/callback/', require('./views/account/settings/index').connectTwitter);
  app.get('/konto/settings/twitter/disconnect/', require('./views/account/settings/index').disconnectTwitter);
  app.get('/konto/settings/github/', passport.authenticate('github', { callbackURL: '/konto/settings/github/callback/' }));
  app.get('/konto/settings/github/callback/', require('./views/account/settings/index').connectGitHub);
  app.get('/konto/settings/github/disconnect/', require('./views/account/settings/index').disconnectGitHub);
  app.get('/konto/settings/facebook/', passport.authenticate('facebook', { callbackURL: '/konto/settings/facebook/callback/' }));
  app.get('/konto/settings/facebook/callback/', require('./views/account/settings/index').connectFacebook);
  app.get('/konto/settings/facebook/disconnect/', require('./views/account/settings/index').disconnectFacebook);
  app.get('/konto/settings/google/', passport.authenticate('google', { callbackURL: '/konto/settings/google/callback/', scope: ['profile email'] }));
  app.get('/konto/settings/google/callback/', require('./views/account/settings/index').connectGoogle);
  app.get('/konto/settings/google/disconnect/', require('./views/account/settings/index').disconnectGoogle);
  app.get('/konto/settings/tumblr/', passport.authenticate('tumblr', { callbackURL: '/konto/settings/tumblr/callback/' }));
  app.get('/konto/settings/tumblr/callback/', require('./views/account/settings/index').connectTumblr);
  app.get('/konto/settings/tumblr/disconnect/', require('./views/account/settings/index').disconnectTumblr);

  //route not found
  app.all('*', require('./views/http/index').http404);
};

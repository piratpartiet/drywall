'use strict';

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.set('X-Auth-Required', 'true');

  if (req.session) {
      req.session.returnUrl = req.originalUrl;
  }

  res.redirect('/login/');
}

function ensureAdmin(req, res, next) {
  if (req.user.canPlayRoleOf('admin')) {
    return next();
  }
  res.redirect('/');
}

function ensureAccount(req, res, next) {
  if (req.user.canPlayRoleOf('konto')) {
    if (req.app.config.requireAccountVerification) {
      if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
        return res.redirect('/konto/verifiser/');
      }
    }
    return next();
  }
  res.redirect('/');
}

exports = module.exports = function(app, passport) {
  //front end
  app.get('/', require('./views/index').init);
  app.get('/om/', require('./views/about/index').init);
  app.get('/kontakt/', require('./views/contact/index').init);
  app.post('/kontakt/', require('./views/contact/index').sendMessage);

  //sign up
  app.get('/registrering/', require('./views/signup/index').init);
  app.post('/registrering/', require('./views/signup/index').signup);

  //social sign up
  app.post('/registrering/social/', require('./views/signup/index').signupSocial);
  app.get('/registrering/twitter/', passport.authenticate('twitter', { callbackURL: '/signup/twitter/callback/' }));
  app.get('/registrering/twitter/callback/', require('./views/signup/index').signupTwitter);
  app.get('/registrering/github/', passport.authenticate('github', { callbackURL: '/signup/github/callback/', scope: ['user:email'] }));
  app.get('/registrering/github/callback/', require('./views/signup/index').signupGitHub);
  app.get('/registrering/facebook/', passport.authenticate('facebook', { callbackURL: '/signup/facebook/callback/', scope: ['email'] }));
  app.get('/registrering/facebook/callback/', require('./views/signup/index').signupFacebook);
  app.get('/registrering/google/', passport.authenticate('google', { callbackURL: '/signup/google/callback/', scope: ['profile email'] }));
  app.get('/registrering/google/callback/', require('./views/signup/index').signupGoogle);
  app.get('/registrering/tumblr/', passport.authenticate('tumblr', { callbackURL: '/signup/tumblr/callback/' }));
  app.get('/registrering/tumblr/callback/', require('./views/signup/index').signupTumblr);

  //login/out
  app.get('/logg-inn/', require('./views/login/index').init);
  app.post('/logg-inn/', require('./views/login/index').login);
  app.get('/logg-inn/forgot/', require('./views/login/forgot/index').init);
  app.post('/logg-inn/forgot/', require('./views/login/forgot/index').send);
  app.get('/logg-inn/reset/', require('./views/login/reset/index').init);
  app.get('/logg-inn/reset/:email/:token/', require('./views/login/reset/index').init);
  app.put('/logg-inn/reset/:email/:token/', require('./views/login/reset/index').set);
  app.get('/logg-ut/', require('./views/logout/index').init);

  //social login
  app.get('/logg-inn/twitter/', passport.authenticate('twitter', { callbackURL: '/login/twitter/callback/' }));
  app.get('/logg-inn/twitter/callback/', require('./views/login/index').loginTwitter);
  app.get('/logg-inn/github/', passport.authenticate('github', { callbackURL: '/login/github/callback/' }));
  app.get('/logg-inn/github/callback/', require('./views/login/index').loginGitHub);
  app.get('/logg-inn/facebook/', passport.authenticate('facebook', { callbackURL: '/login/facebook/callback/' }));
  app.get('/logg-inn/facebook/callback/', require('./views/login/index').loginFacebook);
  app.get('/logg-inn/google/', passport.authenticate('google', { callbackURL: '/login/google/callback/', scope: ['profile email'] }));
  app.get('/logg-inn/google/callback/', require('./views/login/index').loginGoogle);
  app.get('/logg-inn/tumblr/', passport.authenticate('tumblr', { callbackURL: '/login/tumblr/callback/', scope: ['profile email'] }));
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
  app.get('/admin/accounts/', require('./views/admin/accounts/index').find);
  app.post('/admin/accounts/', require('./views/admin/accounts/index').create);
  app.get('/admin/accounts/:id/', require('./views/admin/accounts/index').read);
  app.put('/admin/accounts/:id/', require('./views/admin/accounts/index').update);
  app.put('/admin/accounts/:id/user/', require('./views/admin/accounts/index').linkUser);
  app.delete('/admin/accounts/:id/user/', require('./views/admin/accounts/index').unlinkUser);
  app.post('/admin/accounts/:id/notes/', require('./views/admin/accounts/index').newNote);
  app.post('/admin/accounts/:id/status/', require('./views/admin/accounts/index').newStatus);
  app.delete('/admin/accounts/:id/', require('./views/admin/accounts/index').delete);

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

  //account
  app.all('/konto*', ensureAuthenticated);
  app.all('/konto*', ensureAccount);
  app.get('/konto/', require('./views/account/index').init);

  //account > verification
  app.get('/konto/verifiser/', require('./views/account/verification/index').init);
  app.post('/konto/verifiser/', require('./views/account/verification/index').resendVerification);
  app.get('/konto/verifiser/:token/', require('./views/account/verification/index').verify);

  //account > settings
  app.get('/konto/innstillinger/', require('./views/account/settings/index').init);
  app.put('/konto/innstillinger/', require('./views/account/settings/index').update);
  app.put('/konto/innstillinger/identity/', require('./views/account/settings/index').identity);
  app.put('/konto/innstillinger/password/', require('./views/account/settings/index').password);

  //account > settings > social
  app.get('/konto/innstillinger/twitter/', passport.authenticate('twitter', { callbackURL: '/account/settings/twitter/callback/' }));
  app.get('/konto/innstillinger/twitter/callback/', require('./views/account/settings/index').connectTwitter);
  app.get('/konto/innstillinger/twitter/disconnect/', require('./views/account/settings/index').disconnectTwitter);
  app.get('/konto/innstillinger/github/', passport.authenticate('github', { callbackURL: '/account/settings/github/callback/' }));
  app.get('/konto/innstillinger/github/callback/', require('./views/account/settings/index').connectGitHub);
  app.get('/konto/innstillinger/github/disconnect/', require('./views/account/settings/index').disconnectGitHub);
  app.get('/konto/innstillinger/facebook/', passport.authenticate('facebook', { callbackURL: '/account/settings/facebook/callback/' }));
  app.get('/konto/innstillinger/facebook/callback/', require('./views/account/settings/index').connectFacebook);
  app.get('/konto/innstillinger/facebook/disconnect/', require('./views/account/settings/index').disconnectFacebook);
  app.get('/konto/innstillinger/google/', passport.authenticate('google', { callbackURL: '/account/settings/google/callback/', scope: ['profile email'] }));
  app.get('/konto/innstillinger/google/callback/', require('./views/account/settings/index').connectGoogle);
  app.get('/konto/innstillinger/google/disconnect/', require('./views/account/settings/index').disconnectGoogle);
  app.get('/konto/innstillinger/tumblr/', passport.authenticate('tumblr', { callbackURL: '/account/settings/tumblr/callback/' }));
  app.get('/konto/innstillinger/tumblr/callback/', require('./views/account/settings/index').connectTumblr);
  app.get('/konto/innstillinger/tumblr/disconnect/', require('./views/account/settings/index').disconnectTumblr);

  //route not found
  app.all('*', require('./views/http/index').http404);
};

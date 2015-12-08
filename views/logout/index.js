'use strict';

exports.init = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};
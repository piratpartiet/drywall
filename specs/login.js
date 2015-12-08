'use strict';

/*
 * Specs for /login
 */
var request = require('supertest'),
    agent = require('superagent').agent(),
    express = require('express'),
    db = require('./../models'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    server = require('../app.js'),
    uuid = require('uuid'),
    printf = require('printf');


function getLoginForm(request, done) {
  request
    .get('/login/')
    .set('Accept', 'text/html')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        throw err;
      }

      expect(res.headers).to.include.key('set-cookie');
      expect(res.text).to.contain('Sign Up');

      var cookie = res.headers['set-cookie'];
      var csrfToken = cookie[1].match(/_csrfToken=([^;]*);/)[1];

      agent.saveCookies(res);
      done(agent, csrfToken);
    });
}

exports.login = function(request, done) {
  var username = uuid.v1();
  var password = 'ChuckNorrisWasHere!';

  getLoginForm(request, function(agent, csrfToken) {
    db.User.encryptPassword(password, function(err, hash) {
      if (err) {
        throw err;
      }

      db.User.create({
        isActive: 'yes',
        username: username,
        email: printf('%s@example.com', username),
        password: hash
      }).then(function() {
        request = request.post('/login/');

        agent.attachCookies(request);

        request.send({
            username: username,
            password: password
          })
          .set('Accept', 'application/json')
          .set('X-Csrf-Token', csrfToken)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              throw err;
            }

            var result = JSON.parse(res.text);
            expect(result.success).to.be.true;
            agent.saveCookies(res);
            done(agent);
          });
      }).catch(function(err) {
        throw err;
      });
    });
  });
};

describe('/login/', function() {
  // Create a fresh server instance prior to each test
  beforeEach(function() {
    var app = server.setup(express());
    this.request = request(app);
  });

  var cookie = null;
  var csrfToken = null;

  it('responds with the login form', function(done) {
    this.timeout = 10000;

    this.request
      .get('/login/')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          throw err;
        }

        expect(res.headers).to.include.key('set-cookie');
        cookie = res.headers['set-cookie'];
        csrfToken = cookie[1].match(/_csrfToken=([^;]*);/)[1];
        expect(res.text).to.contain('Sign Up');
        done();
      });
  });

  it('is possible log in', function(done) {
    this.timeout = 10000;
    exports.login(this.request, function(agent) {
      done();
    });
  });
});
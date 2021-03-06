'use strict';

/*
 * Specs for /account
 */
var request = require('supertest'),
    agent = require('superagent'),
    express = require('express'),
    db = require('./../models'),
    chai = require('chai'),
    expect = chai.expect,
    server = require('../app.js'),
    uuid = require('uuid'),
    printf = require('printf'),
    login = require('./login');

describe('/account/', function() {
  // Create a fresh server instance prior to each test
  beforeEach(function() {
    var app = server.setup(express());
    // app.config.logging.debug = true;
    app.db.store.setMaxListeners(0);
    this.request = request(app);
  });

  it('redirects to login', function(done) {
    this.timeout = 10000;

    this.request
      .get('/account/')
      .set('Accept', 'text/html')
      .expect(302)
      .end(function(err, res) {
        if (err) {
          throw err;
        }

        expect(res.headers).to.include.key('location');
        expect(res.headers['location']).to.equal('/login/');
        expect(res.text).to.contain('/login/');
        done();
      });
  });

  it('responds with account index when logged in', function(done) {
    this.timeout = 10000;
    var request = this.request;
    login.login(request, function(agent) {
      request = request.get('/account/');

      agent.attachCookies(request);

      request
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          expect(res.text).to.include('Account');
          done();
        });
    });
  });

  describe('/account/settings/', function() {
    var csrfToken;
    var agent;

    it('responds with settings page when logged in', function(done) {
      var request = this.request;
      login.login(request, function(a) {
        agent = a;
        request = request.get('/account/settings/');

        agent.attachCookies(request);

        request
          .set('Accept', 'text/html')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              throw err;
            }

            expect(res.headers).to.include.key('set-cookie');
            expect(res.text).to.include('Account Settings');

            var cookie = res.headers['set-cookie'];
            // TODO: Don't assume the first cookie will be the CSRF token. Iterate and match all. @asbjornu
            csrfToken = cookie[0].match(/_csrfToken=([^;]*);/)[1];

            agent.saveCookies(res);

            done();
          });
      });
    });

    it('is possible to update contact info', function(done) {
      var request = this.request.put('/account/settings/');

      agent.attachCookies(request);

      request
        .send({
          firstName: 'Chuck',
          middleName: 'Roundhouse',
          lastName: 'Norris',
          company: 'Kicks and Punches Inc.',
          phone: '555-1234-5678',
          zip: '01234'
        })
        .set('X-Csrf-Token', csrfToken)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          var result = JSON.parse(res.text);
          expect(result.success, res.text).to.be.true;
          done();
        });
    });

    it('is possible to change password', function(done) {
      var request = this.request.put('/account/settings/password');

      agent.attachCookies(request);

      request
        .send({
          newPassword: 'NewPassword123',
          confirm: 'NewPassword123'
        })
        .set('X-Csrf-Token', csrfToken)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          var result = JSON.parse(res.text);
          expect(result.success, res.text).to.be.true;
          done();
        });
    });

    it('should fail with invalid e-mail format', function(done) {
      var request = this.request.put('/account/settings/identity');

      agent.attachCookies(request);

      request
        .send({
          username: 'NewUserName123',
          email: 'InvalidEmailFormat'
        })
        .set('X-Csrf-Token', csrfToken)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          var result = JSON.parse(res.text);
          expect(result.success, res.text).to.be.false;
          expect(result.errfor.email, res.text).to.equal('invalid email format');
          done();
        });
    });

    it('is possible to change identity', function(done) {
      var request = this.request.put('/account/settings/identity');

      agent.attachCookies(request);

      request
        .send({
          username: 'NewUserName123',
          email: 'NewEmail123@example.com'
        })
        .set('X-Csrf-Token', csrfToken)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          var result = JSON.parse(res.text);
          expect(result.success, res.text).to.be.true;
          done();
        });
    });
  });
});
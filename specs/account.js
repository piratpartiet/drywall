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
    it('responds with settings page when logged in', function(done) {
      var request = this.request;
      login.login(request, function(agent) {
        request = request.get('/account/settings/');

        agent.attachCookies(request);

        request
          .set('Accept', 'text/html')
          .expect(200)
          .end(function(err, res) {
            if (err) {
              throw err;
            }

            expect(res.text).to.include('Account Settings');
            done();
          });
      });
    })
  });
});
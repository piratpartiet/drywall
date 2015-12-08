'use strict';

/*
 * Specs for /login
 */
var request = require('supertest'),
    express = require('express'),
    db = require('./../models'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    server = require('../app.js'),
    uuid = require('uuid'),
    printf = require('printf');

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
      .expect('Set-Cookie')
      .end(function(err, res) {
        expect(res.headers).to.include.key('set-cookie');
        cookie = res.headers['set-cookie'];
        csrfToken = cookie[1].match(/_csrfToken=([^;]*);/)[1];
        expect(res.text).to.contain('Sign Up');
        done();
      });
  });

  it('is possible log in', function(done) {
    this.timeout = 10000;
    var username = uuid.v1();
    var password = 'ChuckNorrisWasHere!';
    var request = this.request;

    db.User.encryptPassword(password, function(err, hash) {
      if (err) {
        console.error(err);
        return;
      }

      db.User.create({
        isActive: 'yes',
        username: username,
        email: printf('%s@example.com', username),
        password: hash
      }).then(function() {
        request
          .post('/login/')
          .send({
            username: username,
            password: password
          })
          .set('Accept', 'application/json')
          .set('Cookie', cookie)
          .set('X-Csrf-Token', csrfToken)
          .expect(200)
          .end(function(err, res) {
            var result = JSON.parse(res.text);
            expect(result.success).to.be.true;
            done();
          });
      }).catch(console.error);
    });
  });
});
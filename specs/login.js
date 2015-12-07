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
    signup = require('./signup');

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
        cookie = res.headers['set-cookie'];
        csrfToken = cookie[1].match(/_csrfToken=([^;]*);/)[1];
        expect(res.text).to.contain('Sign Up');
        done();
      });
  });

  it('is possible log in', function(done) {
    this.timeout = 10000;

    console.log('login: Signing up');

    var data = signup.signup().apply(this, arguments);

    this.request
      .post('/login/')
      .send(data)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .set('X-Csrf-Token', csrfToken)
      .expect(200)
      .end(function(err, res) {
        expect(res.text).to.contain('"success":true');
        signupDone();
        done();
      });
  });
});
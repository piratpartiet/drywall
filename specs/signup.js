'use strict';

/*
 * Specs for /signup
 */
var request = require('supertest'),
    express = require('express'),
    db = require('./../models'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    server = require('../app.js');

exports.signup = function() {
  // Create a fresh server instance prior to each test
  beforeEach(function() {
    var app = server.setup(express());
    this.request = request(app);
  });

  var cookie = null;
  var csrfToken = null;

  it('responds with the signup form', function(done) {
    this.timeout = 10000;

    this.request
      .get('/signup/')
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

  var signup = function(done) {
    this.timeout = 10000;

    var data = {
      username : 'chuck-norris',
      email: 'chuck-norris@example.com',
      password: 'ChuckNorrisWasHere!'
    };

    this.request
      .post('/signup/')
      .send(data)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .set('X-Csrf-Token', csrfToken)
      .expect(200)
      .end(function(err, res) {
        expect(res.text).to.contain('"success":true');
        done();
      });

    return data;
  };

  it('is possible sign up', signup);

  return signup;
};

describe('/signup/', exports.signup);
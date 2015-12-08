'use strict';

/*
 * Specs for /signup
 */
var request = require('supertest'),
    express = require('express'),
    chai = require('chai'),
    expect = chai.expect,
    server = require('../app.js'),
    uuid = require('uuid'),
    printf = require('printf');

describe('/signup/', function() {
  // Create a fresh server instance prior to each test
  beforeEach(function() {
    var app = server.setup(express());
    this.request = request(app);
  });

  var cookie = null;
  var csrfToken = null;

  it('responds with the signup form', function(done) {
    this.timeout = 5000;

    this.request
      .get('/signup/')
      .set('Accept', 'text/html')
      .expect(200)
      .expect('Set-Cookie')
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

  it('is possible sign up', function(done) {
    this.timeout = 5000;
    var username = uuid.v1();

    this.request
      .post('/signup/')
      .send({
        username : username,
        email: printf('%s@example.com', username),
        password: 'ChuckNorrisWasHere!'
      })
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .set('X-Csrf-Token', csrfToken)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          throw err;
        }

        var result = JSON.parse(res.text);
        expect(result.success).to.be.true;
        done();
      });
  });
});
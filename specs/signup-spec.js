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

describe('/signup/', function() {
  // Create a fresh server instance prior to each test
  beforeEach(function() {
    var app = server.setup(express());
    this.request = request(app);
  });

  it('responds with the signup form', function(done) {
    this.request
      .get('/signup/')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res) {
        expect(res.text).to.contain('Sign Up');
        done();
      });
    });

  it('is possible sign up', function(done) {
    this.request
      .post('/signup/', {
        username : 'chuck-norris',
        email: 'chuck-norris@example.com',
        password: 'ChuckNorrisWasHere!'
      })
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res) {
        // expect(res.address).to.match(/\/account\/$/);
        expect(res.text).to.contain('My Account');
        done();
      });
  });
});
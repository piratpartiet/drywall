/*
 * Specs for the index.js route, the main route of the application.
 */
var request = require('supertest'),
    express = require('express'),
    chai = require('chai'),
    expect = chai.expect,
    server = require('../app.js');

describe('/', function() {
  // Create a fresh server instance prior to each test
  beforeEach(function() {
    this.app = server.setup(express());
  });

  it('responds with the drywall index HTML', function(done) {
    request(this.app)
      .get('/')
      .set('Accept', 'text/html')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          throw err;
        }

        expect(res.text).to.contain('Piratpartiets medlemsdatabase')
        done();
      });
    });
});

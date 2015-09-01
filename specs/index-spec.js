/* Specs for the index.js route, the main route of the application.
 * This app is currently using supertest, a module for express
 * "unit" testing. I put "unit" in quotes because at this point,
 * supertest walks and quacks like an integration test than a unit
 * test. That being said, having integration automated tests serves
 * us better than having no automated tests at all.
 *
 */
var request = require('supertest'),
    express = require('express'),
    db = require('./../models', {logging:console.log}),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

var expect = chai.expect;

var app = require('../app.js');

describe("GET", function() {
    it('responds with an index page in HTML', function() {
    	try {
	        request(app)
	            .get('/')
	            .set('Accept', 'text/html')
	            .expect(200)
	            .end(function(err, res) {
	                expect(res.text).to.contain('Your Node.js website and user system is running');
	            });
    	} catch (error) {
    		console.log("ERROR: " + JSON.stringify(error));
    	}
    });
});

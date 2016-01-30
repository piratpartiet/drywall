var chai = require('chai');
var expect = chai.expect;
var _ = require('lodash');
var sinon = require('sinon');
var faker = require('faker');
var factory = require('factory-girl');
var models = require(process.cwd() + '/models/index');


describe('Models/Account', function () {
    beforeEach(function (done) {
        AccountModel = models.Account;
        done();
    });

    afterEach(function (done) {
        AccountModel = models.Account;
        done();
    });

    describe('account', function () {
        it('should be true', function () {
            console.log("models.Account = " + models.Account);
            expect(models.Account).to.be.an('object');
        });
    });
});
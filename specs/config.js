/*
 * Specs for config
 */
var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;

describe('config', function() {
  it('is in sync with the template', function(done) {
    var config = require('./../config.js');
    var configTemplate = require('./../config.js.tmpl');
    var equal = deepEqualProperties(config, configTemplate);

    expect(equal).to.be.true;
    done();
  });

  it('template is not in sync with random object', function(done) {
    var configTemplate = require('./../config.js.tmpl');
    var diff = deepEqualProperties({ foo: 'bar' }, configTemplate);

    expect(diff).to.not.be.true;
    done();
  });

  it('is not in sync with random object', function(done) {
    var config = require('./../config.js');
    var diff = deepEqualProperties({ foo: 'bar' }, config);

    expect(diff).to.not.be.true;
    done();
  });
});

function deepEqualProperties(a, e, names) {
  var dif = {};
  var names = {
    c: names ? names['a'] : 'Actual',
    d: names ? names['e'] : 'Expected'
  }

  if (!a) {
    dif[names['a']] = typeof a;
  }

  if (!e) {
    dif[names['e']] = typeof e;
  }

  if (Object.keys(dif).length > 0) {
    return dif;
  }

  var aKeys = Object.keys(a);
  var eKeys = Object.keys(e);

  var cKeys = aKeys;
  var dKeys = eKeys;
  var c = a;
  var d = e;

  if (eKeys.length > aKeys.length) {
    cKeys = eKeys;
    dKeys = aKeys;
    c = e;
    d = a;
    names = {
      d: names ? names['a'] : 'Actual',
      c: names ? names['e'] : 'Expected'
    }
  }

  for (var i = 0, co = cKeys.length; i < co; i++) {
    var key = cKeys[i];
    if (typeof c[key] === 'object') {
      if (c[key].length !== undefined) { // array
        var temp = c[key].slice(0);
        temp = temp.filter(function(el) {
          return (d[key].indexOf(el) === -1);
        });
        var message = '';
        if (temp.length > 0) {
          message += names['c'] + ' excess ' + JSON.stringify(temp);
        }

        temp = d[key].slice(0);
        temp = temp.filter(function(el) {
          return (c[key].indexOf(el) === -1);
        });
        if (temp.length > 0) {
          message += ' and ' + names['d'] + ' excess ' + JSON.stringify(temp);
        }
        if (message !== '') {
          dif[key] = message;
        }
        continue;
      }
      var diff = deepEqualProperties(c[key], d[key], {
        a: names['c'],
        e: names['d']
      });
      if (diff !== true && Object.keys(diff).length > 0) {
        dif[key] = diff;
      }
      continue;
    }
  }

  return Object.keys(dif).length > 0 ? dif : true;
}
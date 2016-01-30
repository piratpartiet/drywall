var _     = require('lodash');
var Mocha = require('mocha');
var fs    = require('fs');
var path  = require('path');

var testConfig = {
  NODE_ENV: 'test'
};

_.each(testConfig, function(value, key){
  process.env[key] = value;
});

var mocha = new Mocha({
  timeout:  60000,
  reporter: "spec"
});

["specs/models"].forEach(function(pathName){
  // Here is an example:
  fs.readdirSync(pathName).filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === '.js';

  }).forEach(function(file){
    mocha.addFile(
      path.join(pathName, file)
    );
  });
});

mocha.run(function(failures){
  process.on('exit', function () {
    process.exit(failures);
  });

  process.exit(0);
});
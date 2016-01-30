#!/bin/sh
# Script used to create & set up the test database for Continuous Integration
cp config/config.json.tmpl config/config.json 	 # Copy template file to template
sed -i -- 's/"_INSERT USERNAME_"/"postgres"/g' config/config.json # change username for db
sed -i -- 's/"_INSERT PASSWORD_"/""/g' config/config.json # change password for db

# Drop and create the test database
if [ '$DB' = 'pgsql' ]; then psql -c 'DROP DATABASE IF EXISTS drywall-test;' -U postgres; fi
if [ '$DB' = 'pgsql' ]; then psql -c 'create database drywall-test;' -U postgres; fi	

# Run the code test coverage script. Install istanbul & mocha to run
# the script to create the lcov files.
npm install -g istanbul
npm install -g mocha
npm install -g codeclimate-test-reporter
istanbul cover test.js 
codeclimate-test-reporter < coverage/lcov.info


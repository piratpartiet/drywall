#!/bin/sh
# Script used to create & set up the test database for Continuous Integration
cp config/config.json.tmpl config/config.json 	 # Copy template file to template
sed -i -- 's/"_INSERT USERNAME_"/"postgres"/g' config/config.json # change username for db
sed -i -- 's/"_INSERT PASSWORD_"/""/g' config/config.json # change password for db
# Drop and create the test database
if [ '$DB' = 'pgsql' ]; then psql -c 'DROP DATABASE IF EXISTS drywall-test;' -U postgres; fi
if [ '$DB' = 'pgsql' ]; then psql -c 'create database drywall-test;' -U postgres; fi	
# set up Codeclimate to be run on the codebase
CODECLIMATE_REPO_TOKEN=d59a2529d82564323b652ad2e84bfc4b477270f97207045fd7cd03d38d50ef22 codeclimate-test-reporter < coverage/lcov.info

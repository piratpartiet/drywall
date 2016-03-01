# Drywall

[![Join the chat at https://gitter.im/piratpartiet/drywall](https://badges.gitter.im/piratpartiet/drywall.svg)](https://gitter.im/piratpartiet/drywall?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A website and user system starter. Implemented with Express and Backbone.

This fork uses sequelize to connect to Relational Database Management Systems instead of using Mongoose to connect to Mongo

[![Dependency Status](https://david-dm.org/piratpartiet/drywall.svg?theme=shields.io)](https://david-dm.org/piratpartiet/drywall)
[![devDependency Status](https://david-dm.org/piratpartiet/drywall/dev-status.svg?theme=shields.io)](https://david-dm.org/piratpartiet/drywall#info=devDependencies)
[![Build Status](https://travis-ci.org/piratpartiet/drywall.svg?branch=master)](https://travis-ci.org/piratpartiet/drywall)

## Technology

Server side, Drywall is built with the [Express](http://expressjs.com/)
framework. We're using [Sequelize](http://sequelizejs.com) to connect to
an RDBMS for a data store.

The front-end is built with [Backbone](http://backbonejs.org/).
We're using [Grunt](http://gruntjs.com/) for the asset pipeline.

| On The Server | On The Client  | Development |
| ------------- | -------------- | ----------- |
| Express       | Bootstrap      | Grunt       |
| Jade          | Backbone.js    |             |
| Sequelize     | jQuery         |             |
| Passport      | Underscore.js  |             |
| Async         | Font-Awesome   |             |
| EmailJS       | Moment.js      |             |
| Postgres      |				 |             |

## Live demo

| Platform                       | Username | Password |
| ------------------------------ | -------- | -------- |
| https://drywall.herokuapp.com/ | root     | h3r00t   |

__Note:__ The live demo has been modified so you cannot change the root user,
the root user's linked admin role or the root admin group. This was done in
order to keep the app ready to use at all times.


## Requirements

You need [Node.js](http://nodejs.org/download/) and a Relational Database
Management System such as [Postgres](http://www.postgresql.org/download)
installed and running.

We use [`bcrypt`](https://github.com/ncb000gt/node.bcrypt.js) for hashing
secrets. If you have issues during installation related to `bcrypt` then [refer
to this wiki
page](https://github.com/jedireza/drywall/wiki/bcrypt-Installation-Trouble).


## Installation

```bash
$ git clone git@github.com:piratpartiet/drywall.git && cd ./drywall
$ npm install
```


## Setup

First you need to setup your config file. Create it by copying `config.js.tmpl`
as such:

```bash
$ cp ./config.js.tmpl ./config.js
```

Replace all values with ones that fit your application. Pay extra attention to
the `db` configuration, which control how your database is set up. It has
three environments defined: `development`, `test` and `production`. To get
everything bootstrapped, just focus on `development` for now:

```javascript
exports.db = {
  development: {
    username: '<username>',
    password: '<password>',
    database: '<database>',
    host: '127.0.0.1',
    dialect: 'postgres',
    // Logging to console.log. See the 'Options' section of
    // http://docs.sequelizejs.com/en/1.7.0/docs/usage/ for
    // more information.
    logging: console.log,
    force: false
  }
}
```

* `username`: The username with access to the database.
* `password`: The password associated with the above username.
* `database`: The name of the database for the Drywall application.
* `host`: The name or IP address of the host of the database service.
* `dialect`: The [dialect](http://sequelize.readthedocs.org/en/1.7.0/docs/usage/#dialects)
   of the database.
* `force`: Set to `true` to have the database reset on application launch,
   otherwise set this to `false`. It's a bad idea to set this to `true`
   in production; only set it to `true` if you need to completely wipe
   the database.

### Database

We have made an opiniated decision about which database dialect to use. We will
therefore focus on the setup of PostgreSQL, but the steps required for other
databases would be similar.

Taking for granted that PostgreSQL's binaries exist on your `$PATH`, you need to
execute the following commands to get everything bootstrapped for the
`development` environment (as defined in `config/config.json`).

```bash
psql --command="create user <username> with password '<password>';"
createdb --owner=<username> <database>
```

To set up the database for other environments, just repeat the steps above
for each one.

## Running the app

```bash
$ npm start

# > Drywall@0.0.0 start /Users/jedireza/projects/jedireza/drywall
# > grunt

# Running "copy:vendor" (copy) task
# ...

# Running "concurrent:dev" (concurrent) task
# Running "watch" task
# Running "nodemon:dev" (nodemon) task
# Waiting...
# [nodemon] v1.3.7
# [nodemon] to restart at any time, enter `rs`
# [nodemon] watching: *.*
# [nodemon] starting `node app.js`
# Server is running on port 3000
```

Now just use the reset password feature to set a password.

 - Go to `http://localhost:3000/login/forgot/`
 - Submit your email address and wait a second.
 - Go check your email and get the reset link.
 - `http://localhost:3000/login/reset/:email/:token/`
 - Set a new password.

Login. Customize. Enjoy.


## Testing

The test suite uses [mochajs](https://mochajs.org) and [supertest]
(https://github.com/visionmedia/supertest) to execute end to end
testing. The suite can be executed using the command `npm test`
from the top level of the project.

## Philosophy

 - Create a website and user system.
 - Write code in a simple and consistent way.
 - Only create minor utilities or plugins to avoid repetitiveness.
 - Find and use good tools.
 - Use tools in their native/default behavior.


## Features

 - Basic front end web pages.
 - Contact page has form to email.
 - Login system with forgot password and reset password.
 - Signup and Login with Facebook, Twitter, GitHub, Google and Tumblr.
 - Optional email verification during signup flow.
 - User system with separate account and admin roles.
 - Admin groups with shared permission settings.
 - Administrator level permissions that override group permissions.
 - Global admin quick search component.


## Questions and contributing

Any issues or questions (no matter how basic), open an issue. Please take the
initiative to include basic debugging information like operating system
and relevant version details such as:

```bash
$ npm version

# { drywall: '0.0.0',
#   npm: '2.5.1',
#   http_parser: '2.3',
#   modules: '14',
#   node: '0.12.0',
#   openssl: '1.0.1l',
#   uv: '1.0.2',
#   v8: '3.28.73',
#   zlib: '1.2.8' }
```

Contributions are welcome. Your code should:

 - pass `$ grunt lint` without error

If you're changing something non-trivial, you may want to submit an issue
first.


## License

MIT

# Drywall

<a href="https://codeclimate.com/github/trystant/drywall"><img src="https://codeclimate.com/github/trystant/drywall/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/trystant/drywall/coverage"><img src="https://codeclimate.com/github/trystant/drywall/badges/coverage.svg" /></a>

A website and user system starter. Implemented with Express and Backbone.

This fork uses sequelize to connect to Relational Database Management Systems instead of using Mongoose to connect to Mongo

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

You need [Node.js](http://nodejs.org/download/) and [Postgres](http://www.postgresql.org/download)
9.3 or higher installed and running.

We use [`bcrypt`](https://github.com/ncb000gt/node.bcrypt.js) for hashing
secrets. If you have issues during installation related to `bcrypt` then [refer
to this wiki
page](https://github.com/jedireza/drywall/wiki/bcrypt-Installation-Trouble).


## Installation

```bash
$ git clone git@github.com:trystant/drywall.git && cd ./drywall
$ npm install
```


## Setup

First you need to setup your config file.

```bash
$ mv ./config/config.json.tmpl ./config/config.json # this file contains database credentials
$ mv ./config.js.tmpl ./config.js # this file contains drywall configuration parameters
```

Next, create the desired databases using psql or your favorite database agent.
drywall-development and drywall-test are the default names in the `config/config.json` file,
but those can be changed to whatever is desired.

Next, you need a few records in the database to start using the user system.
The code below should serve as pseudocode for adding a default admin user
to the database, as opposed to exact instructions.


```js
db.admingroups.insert({ _id: 'root', name: 'Root' });
db.admins.insert({ name: {first: 'Root', last: 'Admin', full: 'Root Admin'}, groups: ['root'] });
var rootAdmin = db.admins.findOne();
db.users.save({ username: 'root', isActive: 'yes', email: 'your@email.addy', roles: {admin: rootAdmin._id} });
var rootUser = db.users.findOne();
rootAdmin.user = { id: rootUser._id, name: rootUser.username };
db.admins.save(rootAdmin);
```


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

The test suite uses [mochajs](https://mochajs.org) for unit testing.
The suite can be executed using the command `npm test`
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

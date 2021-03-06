/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.Member = Backbone.Model.extend({
    idAttribute: 'id',
    url: '/account/settings/'
  });

  app.User = Backbone.Model.extend({
    idAttribute: 'id',
    url: '/account/settings/'
  });

  app.Details = Backbone.Model.extend({
    idAttribute: 'id',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      firstName: '',
      middleName: '',
      lastName: '',
      company: '',
      phone: '',
      zip: ''
    },
    url: '/account/settings/',
    parse: function(response) {
      if (response.member) {
        app.mainView.member.set(response.member);
        delete response.member;
      }

      return response;
    }
  });

  app.Identity = Backbone.Model.extend({
    idAttribute: 'id',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      username: '',
      email: ''
    },
    url: '/account/settings/identity/',
    parse: function(response) {
      if (response.user) {
        app.mainView.user.set(response.user);
        delete response.user;
      }

      return response;
    }
  });

  app.Password = Backbone.Model.extend({
    idAttribute: 'id',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      newPassword: '',
      confirm: ''
    },
    url: '/account/settings/password/',
    parse: function(response) {
      if (response.user) {
        app.mainView.user.set(response.user);
        delete response.user;
      }

      return response;
    }
  });

  app.DetailsView = Backbone.View.extend({
    el: '#details',
    template: _.template($('#tmpl-details').html()),
    events: {
      'click .btn-update': 'update'
    },
    initialize: function() {
      this.model = new app.Details();
      this.syncUp();
      this.listenTo(app.mainView.member, 'change', this.syncUp);
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    syncUp: function() {
      this.model.set({
        id: app.mainView.member.id,
        firstName: app.mainView.member.get('firstName'),
        middleName: app.mainView.member.get('middleName'),
        lastName: app.mainView.member.get('lastName'),
        company: app.mainView.member.get('company'),
        phone: app.mainView.member.get('phone'),
        zip: app.mainView.member.get('zip')
      });
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));

      for (var key in this.model.attributes) {
        if (this.model.attributes.hasOwnProperty(key)) {
          this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
        }
      }
    },
    update: function() {
      this.model.save({
        firstName: this.$el.find('[name="firstName"]').val(),
        middleName: this.$el.find('[name="middleName"]').val(),
        lastName: this.$el.find('[name="lastName"]').val(),
        company: this.$el.find('[name="company"]').val(),
        phone: this.$el.find('[name="phone"]').val(),
        zip: this.$el.find('[name="zip"]').val()
      }, {
        type: 'put'
      });
    }
  });

  app.IdentityView = Backbone.View.extend({
    el: '#identity',
    template: _.template($('#tmpl-identity').html()),
    events: {
      'click .btn-update': 'update'
    },
    initialize: function() {
      this.model = new app.Identity();
      this.syncUp();
      this.listenTo(app.mainView.user, 'change', this.syncUp);
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    syncUp: function() {
      this.model.set({
        id: app.mainView.user.id,
        username: app.mainView.user.get('username'),
        email: app.mainView.user.get('email')
      });
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));

      for (var key in this.model.attributes) {
        if (this.model.attributes.hasOwnProperty(key)) {
          this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
        }
      }
    },
    update: function() {
      this.model.save({
        username: this.$el.find('[name="username"]').val(),
        email: this.$el.find('[name="email"]').val()
      });
    }
  });

  app.PasswordView = Backbone.View.extend({
    el: '#password',
    template: _.template($('#tmpl-password').html()),
    events: {
      'click .btn-password': 'password'
    },
    initialize: function() {
      this.model = new app.Password({
        id: app.mainView.user.id
      });
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));

      for (var key in this.model.attributes) {
        if (this.model.attributes.hasOwnProperty(key)) {
          this.$el.find('[name="' + key + '"]').val(this.model.attributes[key]);
        }
      }
    },
    password: function() {
      this.model.save({
        newPassword: this.$el.find('[name="newPassword"]').val(),
        confirm: this.$el.find('[name="confirm"]').val()
      });
    }
  });

  app.MainView = Backbone.View.extend({
    el: '.page .container',
    initialize: function() {
      app.mainView = this;
      this.member = new app.Member(JSON.parse(unescape($('#data-member').html())));
      this.user = new app.User(JSON.parse(unescape($('#data-user').html())));

      app.detailsView = new app.DetailsView();
      app.identityView = new app.IdentityView();
      app.passwordView = new app.PasswordView();
    }
  });

  $(document).ready(function() {
    app.mainView = new app.MainView();
  });
}());
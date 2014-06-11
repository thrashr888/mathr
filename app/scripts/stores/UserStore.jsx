/**
 * @jsx React.DOM
 */

'use strict';

var Fluxxor = require('fluxxor/index.js');

var Firebase = require('firebase-client');
var FirebaseSimpleLogin = require('firebase-simple-login');

var UserStore = Fluxxor.createStore({
  actions: {
    'LOGIN': 'onLogin',
    'LOGOUT': 'onLogout'
  },

  initialize: function() {
    this.dbRef = new Firebase(window.__config.firebaseHost);
    this.auth = new FirebaseSimpleLogin(this.dbRef, this.authStateChanged);

    this.user = {};
  },

  authStateChanged: function (err, user) {
    if (err) {
      console.error(err);
    }

    if (user) {
      console.log('user logged in: ', user);
      this.user = user;
      this.emit('change');
    } else {
      console.log('logged out');
    }
  },

  onLogin: function() {
    this.auth.login('twitter', {
        rememberMe: true
    });
  },

  onLogout: function() {
    this.auth.logout();
    this.user = {};
    // location.path = '/';
    location.hash = '';
    history.pushState({}, 'home', '/');
  },

  getState: function() {
    return {
      user: this.user
    };
  }
});

module.exports = UserStore;
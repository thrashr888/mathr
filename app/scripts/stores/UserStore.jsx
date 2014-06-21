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

  provider: 'google',

  initialize: function initialize(userSession) {
    this.dbRef = new Firebase(window.__config.firebaseHost);
    this.auth = new FirebaseSimpleLogin(this.dbRef, this.authStateChanged);

    this.user = {};

    if (userSession && userSession.user) {
      // console.log('userSession', userSession.user)
      this.user = userSession.user;
      this.unifyUserProperties();
    }
  },

  unifyUserProperties: function unifyUserProperties () {
    /*jshint camelcase:false*/
    this.user.image_url = this.user.profile_image_url || this.user.thirdPartyUserData.picture;
  },

  authStateChanged: function authStateChanged (err, user) {
    if (err) {
      console.error(err);
    } else if (user) {
      console.debug('user logged in: ', user);
      console.info('user logged in');
      this.user = user;
      this.unifyUserProperties();
      this.emit('change');
    } else {
      // TODO this should be a logout but there's a bug in the
      // google provider that doesn't return the user data we need
      // this.user = {};
      // this.emit('change');
      console.info('logged out');
    }
  },

  onLogin: function onLogin() {
    this.auth.login(this.provider, {
        rememberMe: true,
        scope: 'https://www.googleapis.com/auth/plus.login'
    });
  },

  onLogout: function onLogout() {
    this.auth.logout();

    this.user = {};
    this.emit('change');
    console.info('logged out');

    // location.path = '/';
    location.hash = '';
    history.pushState({}, 'home', '/');
  },

  getState: function getState() {
    return this.user;
  }
});

module.exports = UserStore;
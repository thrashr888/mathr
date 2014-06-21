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

  initialize: function initialize() {
    this.dbRef = new Firebase(window.__config.firebaseHost + '/user');
    this.auth = new FirebaseSimpleLogin(this.dbRef, this.authStateChanged);

    // this.dbRef.on("child_added", function(dataSnapshot) {
    //   this.items.push(dataSnapshot.val());
    //   this.setState({
    //     items: this.items
    //   });
    // }.bind(this));

    if (window.localStorage.firebaseSession) {
      this.onLogin();
    }

    this.user = {};
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
    // location.path = '/';
    location.hash = '';
    history.pushState({}, 'home', '/');
    this.emit('change');
  },

  getState: function getState() {
    return {
      user: this.user
    };
  }
});

module.exports = UserStore;
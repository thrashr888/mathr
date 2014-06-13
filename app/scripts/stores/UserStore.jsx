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

  initialize: function() {
    this.dbRef = new Firebase(window.__config.firebaseHost);
    this.auth = new FirebaseSimpleLogin(this.dbRef, this.authStateChanged);

    // this.dbRef.on("child_added", function(dataSnapshot) {
    //   this.items.push(dataSnapshot.val());
    //   this.setState({
    //     items: this.items
    //   });
    // }.bind(this));

    this.user = {};
  },

  unifyUserProperties: function () {
    /*jshint camelcase:false*/
    this.user.image_url = this.user.profile_image_url || this.user.thirdPartyUserData.picture;
  },

  authStateChanged: function (err, user) {
    if (err) {
      console.error(err);
    }

    if (user) {
      console.log('user logged in: ', user);
      this.user = user;
      this.unifyUserProperties();
      this.emit('change');
    } else {
      console.log('logged out');
    }
  },

  onLogin: function() {
    this.auth.login(this.provider, {
        rememberMe: true,
        scope: 'https://www.googleapis.com/auth/plus.login'
    });
  },

  onLogout: function() {
    this.auth.logout();
    this.user = {};
    // location.path = '/';
    location.hash = '';
    history.pushState({}, 'home', '/');
    this.emit('change');
  },

  getState: function() {
    return {
      user: this.user
    };
  }
});

module.exports = UserStore;
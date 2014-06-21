/**
 * @jsx React.DOM
 */

'use strict';

var Fluxxor = require('fluxxor/index.js');
var Firebase = require('firebase-client');
var FirebaseHelper = require('../lib/FirebaseHelper.jsx');

var ConfigStore = Fluxxor.createStore({
  actions: {
    'UPDATE_CONFIG': 'onUpdateConfig'
  },

  initialize: function initialize() {
    this.dbRef = new Firebase(window.__config.firebaseHost + '/config');

    this.config = FirebaseHelper.getSynchronizedArray(this.dbRef);
  },

  onUpdateConfig: function onUpdateConfig(payload) {
    this.config[payload.key] = payload.value;
    this.config.$set(payload.key, payload.value);
    this.emit('change');
  },

  getState: function getState() {
    return this.config;
  }
});

module.exports = ConfigStore;
/**
 * @jsx React.DOM
 */

'use strict';

var Fluxxor = require('fluxxor/index.js');
var uuid = require('node-uuid');

var ErrorStore = Fluxxor.createStore({
  actions: {
    'ADD_ERROR': 'onAddError',
    'CLEAR_ERRORS': 'onClearErrors'
  },

  initialize: function() {
    this.errors = [];
  },

  onAddError: function(payload) {
    // console.log(payload)
    this.errors.push({
      id: payload.id || uuid.v4(),
      message: payload.message,
      time: (new Date())
    });
    this.emit('change');
  },

  onClearErrors: function() {
    this.errors = [];
    this.emit('change');
  },

  getState: function() {
    return {
      errors: this.errors
    };
  }
});

module.exports = ErrorStore;
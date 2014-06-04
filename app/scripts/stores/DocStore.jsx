/**
 * @jsx React.DOM
 */

'use strict';

var Fluxxor = require('../../../node_modules/fluxxor/index.js');

// TODO: switch to using this doc store
var DocStore = Fluxxor.createStore({
  actions: {
    'GET_DOC': 'onGetDoc',
    'CLEAR_DOC': 'onClearPages'
  },

  initialize: function() {
    this.doc = {};
  },

  onGetDoc: function (payload) {
    $.ajax({
      url: payload.url,
      dataType: 'json',
      success: function(doc) {
        this.doc = doc;
        // PageStore.onAddPages({pages: doc.pages});
        this.emit('change');
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(payload.url, status, err.toString());
      }.bind(this)
    });
  },

  getState: function() {
    return {
      doc: this.doc
    };
  }
});

module.exports = DocStore;
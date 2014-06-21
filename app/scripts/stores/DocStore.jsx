/**
 * @jsx React.DOM
 */
/*globals $*/

'use strict';

var Fluxxor = require('fluxxor/index.js');

// TODO: switch to using this doc store
var DocStore = Fluxxor.createStore({
  actions: {
    'ADD_DOC': 'onAddDoc',
    'ADD_DOCS': 'onAddDocs',
    'GET_DOCS': 'onGetDocs',
    'CLEAR_DOCS': 'onClearDocs'
  },

  initialize: function initialize() {
    this.docs = [];
  },

  onAddDoc: function onAddDoc(payload) {
    // console.log(payload)
    this.docs.push({
      id: payload.doc.id || uuid.v4(),
      name: payload.doc.name
    });
    this.emit('change');
  },

  onAddDocs: function onAddDocs(payload) {
    for (var i = 0, l = payload.docs.length; i < l; i++) {
      var doc = payload.docs[i];
      this.docs.push({
        id: doc.id || uuid.v4(),
        name: doc.name
      });
    }
    this.emit('change');
  },

  onGetDocs: function onGetDocs(payload) {
      // console.log(payload)
    $.ajax({
      url: payload.url,
      dataType: 'json',
      success: function(res) {
        this.onAddDocs({docs: res.docs});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(payload.url, status, err.toString());
      }.bind(this)
    });
  },

  getState: function getState() {
    return {
      docs: this.docs
    };
  }
});

module.exports = DocStore;
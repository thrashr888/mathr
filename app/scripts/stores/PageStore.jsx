/**
 * @jsx React.DOM
 */

'use strict';

var PageStore = Fluxxor.createStore({
  actions: {
    'ADD_PAGE': 'onAddPage',
    'ADD_PAGES': 'onAddPages',
    'TOGGLE_PAGE': 'onTogglePage',
    'UPDATE_PAGE': 'onUpdatePage',
    'CLEAR_PAGES': 'onClearPages',
    'GET_PAGES': 'onGetPages'
  },

  initialize: function() {
    this.pages = [];
  },

  onAddPage: function(payload) {
    // console.log(payload)
    this.pages.push({
      id: payload.page.id || UUIDjs.create(4).toString(),
      type: payload.page.type,
      name: payload.page.name,
      input: payload.page.input,
      output: null,
      hidden: false
    });
    this.emit('change');
  },

  onAddPages: function(payload) {
    for (var i = 0, l = payload.pages.length; i < l; i++) {
      var page = payload.pages[i];
      this.pages.push({
        id: page.id || UUIDjs.create(4).toString(),
        type: page.type,
        name: page.name,
        input: page.input,
        output: null,
        hidden: false
      });
    }
    this.emit('change');
  },

  onTogglePage: function(payload) {
    payload.page.hidden = !payload.page.hidden;
    this.emit('change');
  },

  onUpdatePage: function(payload) {
    // console.log(payload)
    this.emit('change');
  },

  onClearPages: function() {
    this.pages = this.pages.filter(function(page) {
      return page.hidden;
    });
    this.emit('change');
  },

  onGetPages: function(payload) {
    // TODO: replace me with a better store
    $.ajax({
      url: payload.url,
      dataType: 'json',
      success: function(doc) {
        // this.setState({pages: pages});
        this.onAddPages({pages: doc.pages});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(payload.url, status, err.toString());
      }.bind(this)
    });
  },

  getState: function() {
    return {
      pages: this.pages
    };
  }
});

module.exports = PageStore;
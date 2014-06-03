/**
 * @jsx React.DOM
 */

'use strict';

/**
 * Flux Actions
 */
var actions = {
  addPage: function(page) {
    this.dispatch('ADD_PAGE', {page: page});
  },
  addPages: function(pages) {
    this.dispatch('ADD_PAGES', {pages: pages});
  },
  togglePage: function(page) {
    this.dispatch('TOGGLE_PAGE', {page: page});
  },
  updatePage: function(page) {
    this.dispatch('UPDATE_PAGE', {page: page});
  },
  clearPages: function() {
    this.dispatch('CLEAR_PAGES');
  },
  getPages: function(url) {
    this.dispatch('GET_PAGES', {url: url});
  },
  addError: function(message) {
    this.dispatch('ADD_ERROR', {message: message});
  },
  getDoc: function(url) {
    this.dispatch('GET_DOC', {url: url});
  }
};

module.exports = actions;
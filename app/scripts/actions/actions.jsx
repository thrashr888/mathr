/**
 * @jsx React.DOM
 */

'use strict';

/**
 * Flux Actions
 */
var actions = {
  addPage: function addPage(page) {
    this.dispatch('ADD_PAGE', {page: page});
  },
  addPages: function addPages(pages) {
    this.dispatch('ADD_PAGES', {pages: pages});
  },
  togglePage: function togglePage(page) {
    this.dispatch('TOGGLE_PAGE', {page: page});
  },
  updatePage: function updatePage(page, hasOutput) {
    this.dispatch('UPDATE_PAGE', {page: page, hasOutput: hasOutput || false});
  },
  clearPages: function clearPages() {
    this.dispatch('CLEAR_PAGES');
  },
  getPages: function getPages(url) {
    this.dispatch('GET_PAGES', {url: url});
  },
  addError: function addError(message) {
    this.dispatch('ADD_ERROR', {message: message});
  },
  getDocs: function getDocs(url) {
    this.dispatch('GET_DOCS', {url: url});
  },
  login: function login() {
    this.dispatch('LOGIN');
  },
  logout: function logout() {
    this.dispatch('LOGOUT');
  },
  updateConfig: function updateConfig(key, value) {
    this.dispatch('UPDATE_CONFIG', {key: key, value: value});
  }
};

module.exports = actions;
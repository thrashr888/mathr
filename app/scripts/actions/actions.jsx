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
  updatePage: function updatePage(page, hasOutput) {
    this.dispatch('UPDATE_PAGE', {page: page, hasOutput: hasOutput || false});
  },
  addError: function addError(message) {
    this.dispatch('ADD_ERROR', {message: message});
  },
  getDocs: function getDocs(url) {
    this.dispatch('GET_DOCS', {url: url});
  },
  updateConfig: function updateConfig(key, value) {
    this.dispatch('UPDATE_CONFIG', {key: key, value: value});
  },
  login: function login() {
    this.dispatch('LOGIN');
  },
  logout: function logout() {
    this.dispatch('LOGOUT');
  }
};

module.exports = actions;
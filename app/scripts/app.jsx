/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');

var UserStore = require('./stores/UserStore.jsx');
var DocStore = require('./stores/DocStore.jsx');
var PageStore = require('./stores/PageStore.jsx');
var ErrorStore = require('./stores/ErrorStore.jsx');

var actions = require('./actions/actions.jsx');

var Application = require('./components/Application.jsx');

/**
 * Flux Stores
 */
var stores = {
  UserStore: new UserStore(),
  DocStore: new DocStore(),
  PageStore: new PageStore(),
  ErrorStore: new ErrorStore()
};

/**
 * Flux Init
 */
var flux = new Fluxxor.Flux(stores, actions);
var FluxMixin = Fluxxor.FluxMixin(React),
    FluxChildMixin = Fluxxor.FluxChildMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

/**
 * Render Application Component
 */
React.renderComponent(
  <Application
    docs={window.__config.apiEndpoint + '/doc'}
    pages={window.__config.apiEndpoint + '/doc/1'}
    flux={flux}
    />,
  document.getElementById('main')
);

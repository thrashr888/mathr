/**
 * @jsx React.DOM
 */

'use strict';


var DocStore = require('./stores/DocStore.jsx');
var PageStore = require('./stores/PageStore.jsx');
var ErrorStore = require('./stores/ErrorStore.jsx');

var actions = require('./actions/actions.jsx');

var Application = require('./components/Application.jsx');

/**
 * Flux Stores
 */
var stores = {
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
  <Application url="/scripts/fixtures/doc1.json" flux={flux} />,
  document.getElementById('page1')
);

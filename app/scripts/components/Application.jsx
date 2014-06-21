/**
 * @jsx React.DOM
 */

'use strict';

var VERSION_NUMBER = '0.0.1';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    FluxChildMixin = Fluxxor.FluxChildMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ControlPanel = require('./ControlPanel.jsx');
var DocList = require('./DocList.jsx');
var PageList = require('./PageList.jsx');
var ErrorList = require('./ErrorList.jsx');
var Footer = require('./Footer.jsx');

/**
 * Application View
 */
var Application = React.createClass({
  mixins: [FluxMixin, new StoreWatchMixin(
    'UserStore',
    'ConfigStore',
    'DocStore',
    'PageStore',
    'ErrorStore'
    )],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    // console.log(flux.store('PageStore'))
    // console.log(flux.store('ErrorStore'))
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    return {
      user: flux.store('UserStore').getState(),
      config: flux.store('ConfigStore').getState(),
      docs: flux.store('DocStore').getState(),
      pages: flux.store('PageStore').getState(),
      errors: flux.store('ErrorStore').getState()
    };
  },

  componentWillMount: function() {
    // console.log(this);
    this.getFlux().actions.getDocs(this.props.docs);
    this.getFlux().actions.getPages(this.props.pages);
  },

  getInitialState: function() {
    return {};
  },

  render: function () {
    //<Func item={this.state.pages[2]} />
    // console.log('app state', this.state)
    return (
      <div className={(this.state.config.darkTheme ? 'dark-theme' : null) + ' container-fluid'}>
        <ControlPanel className="" user={this.state.user ? this.state.user : null} onConfigChange={this.handleConfigChange} config={this.state.config} />
        <DocList className="col-xs-12 col-sm-3 col-md-3 col-lg-3" docs={this.state.docs ? this.state.docs.docs : null} config={this.state.config} />
        <PageList className="col-xs-12 col-sm-9 col-md-9 col-lg-9" pages={this.state.pages ? this.state.pages.pages : null} config={this.state.config} />
        <ErrorList className="col-md-12 col-lg-12 row" errors={this.state.errors ? this.state.errors.errors : null} config={this.state.config} />
        <Footer className="col-md-12 col-lg-12 row" versionNumber={VERSION_NUMBER} />
      </div>
    );
  }
});

module.exports = Application;
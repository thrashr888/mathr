/**
 * @jsx React.DOM
 */
/*globals StoreWatchMixin, FluxMixin*/

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    FluxChildMixin = Fluxxor.FluxChildMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Note = require('./Note.jsx');
var Func = require('./Func.jsx');
var Sheet = require('./Sheet.jsx');
var ErrorList = require('./ErrorList.jsx');

/**
 * Application View
 */
var Application = React.createClass({
  mixins: [FluxMixin, new StoreWatchMixin('DocStore', 'PageStore', 'ErrorStore')],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    // console.log(flux.store('PageStore'))
    // console.log(flux.store('ErrorStore'))
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    return {
      doc: flux.store('DocStore').getState(),
      pages: flux.store('PageStore').getState(),
      errors: flux.store('ErrorStore').getState(),
    };
  },

  componentWillMount: function() {
    // console.log(this);
    // this.getFlux().actions.getDoc(this.props.url);
    this.getFlux().actions.getPages(this.props.url);
  },
  getInitialState: function() {
    return {};
  },
  render: function () {
    //<Func item={this.state.pages[2]} />
    // console.log(this.state)
    var pageList = this.state.pages.pages.map(function (item) {
      switch (item.type) {
        case 'note':
          return <Note item={item} key={item.id} />;
        case 'function':
          return <Func item={item} key={item.id} />;
        case 'table':
          return <Sheet item={item} key={item.id} />;
        default:
          return null;
      }
    });
    return (
      <div className="container">
        {pageList}
        <ErrorList errors={this.state.errors ? this.state.errors.errors : null} />
      </div>
    );
  }
});

module.exports = Application;
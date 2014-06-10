/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

/**
 * Control Panel View
 */
var ControlPanel = React.createClass({
  mixins: [FluxChildMixin],

  handleAddPage: function (event) {
    var type = $(event.target).data('type');
    var item = {
      type: type,
      name: 'New ' + type,
      input: ''
    };
    this.getFlux().actions.addPage(item);
    // TODO scroll to the new item
  },

  componentDidMount: function () {
    // this.getFlux().actions.updatePage(this.props.item);
  },

  render: function () {
    return (
      <nav role="navigation" className="navbar navbar-default m-controlpanel m-controlpanel--container">
        <ul className="nav navbar-nav">
          <li><a className="btn" href="#" onClick={this.handleAddPage} data-type="note">Add a Note</a></li>
          <li><a className="btn" href="#" onClick={this.handleAddPage} data-type="table">Add a Table</a></li>
          <li><a className="btn" href="#" onClick={this.handleAddPage} data-type="func">Add a Func</a></li>
        </ul>
      </nav>
    );
  }
});

module.exports = ControlPanel;
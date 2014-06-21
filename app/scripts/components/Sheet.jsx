/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var HandsOnTable = require('./HandsOnTable.jsx');

/**
 * Sheet Views
 */
var Sheet = React.createClass({
  mixins: [FluxChildMixin],

  handleInputUpdate: function (update, changes) {
    if (this.props.item.input !== update) {
      this.props.item.input = update;
      this.getFlux().actions.updatePage(this.props.item);
    }
  },

  handleTitleUpdate: function (event, b) {
    this.props.item.name = event.target.value;
    this.getFlux().actions.updatePage(this.props.item);
  },

  componentDidMount: function () {
    this.getFlux().actions.updatePage(this.props.item);
  },

  getInitialState: function() {
    return {
      config: {}
    };
  },

  render: function () {
    return (
      <div className="m-sheet m-sheet--container col-md-12">
        <h3 className="row m-sheet--hed"><input className="m-sheet--title" value={this.props.item ? this.props.item.name : ''} type="text" onChange={this.handleTitleUpdate} /></h3>
        <div className="row m-sheet--row">
          <HandsOnTable
            input={this.props.item.input ? this.props.item.input : ''}
            onInputUpdate={this.handleInputUpdate}
            key={this.props.item.id}
            className="col-md-12 col-xs-12" />
        </div>
      </div>
    );
  }
});

module.exports = Sheet;
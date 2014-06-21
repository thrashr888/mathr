/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var EditorInput = require('./EditorInput.jsx');
var EditorOutput = require('./EditorOutput.jsx');

/**
 * Notes View
 */
var Note = React.createClass({
  mixins: [FluxChildMixin],

  handleInputUpdate: function (update, change) {
    if (this.props.item.input !== update) {
      this.props.item.input = update;
      this.getFlux().actions.updatePage(this.props.item, true);
    }
  },

  handleTitleUpdate: function (event, b) {
    this.props.item.name = event.target.value;
    this.getFlux().actions.updatePage(this.props.item, true);
  },

  componentDidMount: function () {
    this.getFlux().actions.updatePage(this.props.item, true);
  },

  render: function () {
    // console.log('config', this.props.config)
    return (
      <div className="row m-note m-note--container col-md-12">
        <h3 className="row m-note--hed"><input className="m-note--title" value={this.props.item ? this.props.item.name : ''} type="text" onChange={this.handleTitleUpdate} /></h3>
        <div className="row m-note--row">
          <EditorInput
            input={this.props.item.input ? this.props.item.input : ''}
            onInputUpdate={this.handleInputUpdate}
            mode="note"
            darkTheme={this.props.config ? this.props.config.darkTheme : null}
            key={this.props.item.id}
            className="col-md-8 col-xs-8" />
          <EditorOutput
            output={this.props.item.output ? this.props.item.output : ''}
            className="col-md-4 col-xs-4"
            />
        </div>
      </div>
    );
  }
});

module.exports = Note;
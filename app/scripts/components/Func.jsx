/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var EditorInput = require('./EditorInput.jsx');

/**
 * Func View
 */
var Func = React.createClass({
  mixins: [FluxChildMixin],

  handleInputUpdate: function (input) {
    // console.log('input update:', input);
    // this.getFlux().actions.updatePage(this.props.item);
  },
  render: function () {
    // console.log(this.props.item.input.split('\n').length)
    return (
      <div className="row m-func m-note--container col-md-12">
        <h3 className="row m-note--hed">{this.props.item ? this.props.item.name : ''}</h3>
        <div className="row m-note--row">
          <EditorInput
            input={this.props.item.input ? this.props.item.input : ''}
            onInputUpdate={this.handleInputUpdate}
            mode="func"
            className="col-md-12 col-xs-12" />
        </div>
      </div>
    );
  }
});

module.exports = Func;
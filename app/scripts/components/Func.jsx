/**
 * @jsx React.DOM
 */

'use strict';

var Gutter = require('./Gutter.jsx');
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
          <Gutter key={this.props.item.id} rows={this.props.item.input ? this.props.item.input.split('\n').length : 10} />
          <EditorInput input={this.props.item.input ? this.props.item.input : ''} onInputUpdate={this.handleInputUpdate} />
        </div>
      </div>
    );
  }
});

module.exports = Func;
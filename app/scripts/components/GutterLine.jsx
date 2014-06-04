/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

/**
 * Gutter Views
 */
var GutterLine = React.createClass({
  render: function () {
    return (
      <a data-line={this.props.line} name={"l_"+this.props.key} href={"#l_"+this.props.key} key={this.props.key}>{this.props.line}</a>
    );
  }
});

module.exports = GutterLine;
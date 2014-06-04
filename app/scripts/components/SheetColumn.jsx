/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

/**
 * Sheet Views
 */

var SheetColumn = React.createClass({
  render: function () {
    return (
      <td data-col={this.props.col}>{this.props.val}</td>
    );
  }
});

module.exports = SheetColumn;
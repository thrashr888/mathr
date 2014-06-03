/**
 * @jsx React.DOM
 */

'use strict';

var SheetColumn = require('./SheetColumn.jsx');

/**
 * Sheet Views
 */
var SheetRow = React.createClass({
  render: function () {
    return (
      <tr data-row="{this.props.row}">
        <SheetColumn col="a" val={this.props.a} />
        <SheetColumn col="b" val={this.props.b} />
      </tr>
    );
  }
});

module.exports = SheetRow;
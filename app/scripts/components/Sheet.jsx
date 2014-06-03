/**
 * @jsx React.DOM
 */

'use strict';

var SheetRow = require('./SheetRow.jsx');

/**
 * Sheet Views
 */
var Sheet = React.createClass({
  // TODO: use this? http://handsontable.com/
  render: function () {
    return (
      <table data-table="1" className="table m-sheet m-sheet--container">
        <thead>
          <th>Sheet Name</th>
        </thead>
        <SheetRow row="1" a="coffee" b="$4.00" />
        <SheetRow row="2" a="milk" b="$3.75" />
        <SheetRow row="3" a="water" b="$6.25" />
      </table>
    );
  }
});

module.exports = Sheet;
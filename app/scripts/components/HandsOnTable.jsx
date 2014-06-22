/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

var jQuery = require('jquery');
var _ = require('jquery-handsontable/dist/jquery.handsontable.full');

/**
 * HandsOnTable Views
 */
var HandsOnTable = React.createClass({

  input: null,

  installRTE: function () {
    var el = this.getDOMNode();

    // console.log(this.props.input)
    this.rte = $(el).handsontable({
      data: this.props.input || null,
      startRows: 6,
      startCols: 4,
      minRows: 3,
      minCols: 3,
      // width: 'auto',
      height: 200,
      stretchH: 'all',
      colWidths: 55,
      rowHeaders: true,
      colHeaders: true,
      minSpareRows: 1,
      minSpareCols: 1,
      persistentState: true,
      currentRowClassName: 'currentRow',
      currentColClassName: 'currentCol',
      afterChange: this.handleChange
    });

    // from bootstrap: 'table-bordered table-striped table-hover'
    $(el).find('table').addClass('table-hover');
  },

  componentDidMount: function () {
    if (!this.rte) {
      this.installRTE();
    }
  },

  _syncChanges: function (input, changes) {
    // ex. [row, col, old, new]
    // ex. [3, 2, "ice", "water"]
    var output = input;
    for (var i in changes) {
      var change = changes[i];

      if (!output[change[0]]) {
        output[change[0]] = [];
      }
      output[change[0]][change[1]] = change[3];
    }
    return output;
  },

  handleChange: function (changes, source) {
    // console.log('change', changes, source);
    if (changes) {
      this.input = this._syncChanges(this.props.input, changes);
      this.props.onInputUpdate(this.input, changes);
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (!this.rte) {
      this.installRTE();
    }
    // console.log(nextProps.input, this.input)
    if (nextProps.input !== this.input) {
      // TODO: do this only sparingly under certain conditions
      // this might have been updated from the editor itself.
      // console.log(this.rte)
      // this.rte.loadData(nextProps.input);
    }
  },

  render: function () {
    return (
      <div className={this.props.className + ' editor m-sheet--input'}></div>
    );
  }
});

module.exports = HandsOnTable;
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
      minRows: 2,
      minCols: 2,
      // width: 'auto',
      // height: 'auto',
      afterChange: this.handleChange
    });
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
    if (nextProps.input !== this.input) {
      // TODO: do this only sparingly under certain conditions
      // this might have been updated from the editor itself.
      this.rte.loadData(nextProps.input);
    }
  },

  render: function () {
    return (
      <div className={this.props.className + ' editor m-sheet--input'}></div>
    );
  }
});

module.exports = HandsOnTable;
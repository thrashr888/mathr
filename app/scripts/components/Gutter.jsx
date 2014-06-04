/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

/**
 * Gutter Views
 */
var GutterLine = require('./GutterLine.jsx');

var Gutter = React.createClass({
  countLines: function (rows) {
    var gNums = [];
    for (var i = 1; i <= rows; i++) {
      gNums.push(i);
    }
    this.setState({lines: gNums});
  },
  componentWillMount: function() {
    this.countLines(this.props.rows);
  },
  componentWillReceiveProps: function (nextProps) {
    this.countLines(nextProps.rows);
  },
  render: function () {
    var gutterLines = this.state.lines.map(function (line) {
      return <GutterLine line={line} key={this.props.key+'_'+line} />;
    }.bind(this));
    return (
      <div className="gutter col-md-1 col-xs-1 m-note--gutter">
        {gutterLines}
      </div>
    );
  }
});

module.exports = Gutter;
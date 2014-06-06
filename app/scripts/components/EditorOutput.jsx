/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

var EditorOutputLine = require('./EditorOutputLine.jsx');

var EditorOutput = React.createClass({
  render: function () {
    var lineList = this.props.output ? this.props.output.map(function (text, i) {
      return <EditorOutputLine text={text} key={i}/>;
    }) : [];
    return (
      <div className="col-md-5 col-xs-5 m-note--output">{lineList}</div>
    );
  }
});

module.exports = EditorOutput;
/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

var EditorOutputLine = React.createClass({
  render: function () {
    // console.log(this.props)
    // this is an array. some of the values are arrays. we can use them more wisely.
    return (
      <span dangerouslySetInnerHTML={{__html: this.props.text ? this.props.text : '&nbsp;'}}></span>
    );
  }
});

module.exports = EditorOutputLine;
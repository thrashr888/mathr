/**
 * @jsx React.DOM
 */

'use strict';

var EditorOutputLine = React.createClass({
  render: function () {
    // console.log(this.props)
    // this is an array. some of the values are arrays. we can use them more wisely.
    return (
      <span dangerouslySetInnerHTML={{__html: this.props.text}}></span>
    );
  }
});

module.exports = EditorOutputLine;
/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

/**
 * Error Views
 */

var DocItem = React.createClass({

  handleClick: function (id, event) {
    // console.log(id, event)
    this.props.onClick(id, event);
  },

  render: function () {
    return (
      <li><a href="#" onClick={this.handleClick.bind(this, this.props.doc.id)}>{this.props.doc.name}</a></li>
    );
  }
});

module.exports = DocItem;
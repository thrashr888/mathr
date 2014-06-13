/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

/**
 * Footer View
 */
var Footer = React.createClass({
  render: function () {
    return (
      <footer className={this.props.className + ' row'}>mathr v{this.props.versionNumber} &copy;2014 Paul Thrasher</footer>
    );
  }
});

module.exports = Footer;
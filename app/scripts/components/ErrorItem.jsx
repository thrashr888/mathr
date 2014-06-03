/**
 * @jsx React.DOM
 */

'use strict';

/**
 * Error Views
 */
var ErrorItem = React.createClass({
  render: function () {
    return (
      <p>{'#' + this.props.key +
        ' (' +
          this.props.error.time.getUTCMinutes() + ':' +
          this.props.error.time.getUTCSeconds() + '.' +
          this.props.error.time.getUTCMilliseconds() +
          ')' + ': ' +
        this.props.error.message}</p>
    );
  }
});

module.exports = ErrorItem;
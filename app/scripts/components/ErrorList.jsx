/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var ErrorItem = require('./ErrorItem.jsx');

var ErrorList = React.createClass({
  mixins: [FluxChildMixin],

  render: function () {
    var errorLines = this.props.errors.map(function (error, index) {
      return <ErrorItem error={error} key={index+1} />
    }.bind(this));
    // console.log('errors', this.props.errors)
    return (
      <div className={this.props.className + ' row m-error m-error--container'}>
        <h3 className="row m-error--hed">Error Log</h3>
        <div className="row m-error--row">
          {this.props.errors ? errorLines.reverse() : <p>No errors (yet).</p>}
        </div>
      </div>
    );
  }
});

module.exports = ErrorList;
/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var Note = require('./Note.jsx');
var Func = require('./Func.jsx');
var Sheet = require('./Sheet.jsx');

var PageList = React.createClass({
  mixins: [FluxChildMixin],

  render: function () {
    // console.log('pages:', this.props.pages)
    var pageList = this.props.pages.map(function (item) {
      switch (item.type) {
        case 'note':
          return <Note item={item} key={item.id} config={this.props.config} />;
        case 'function':
          return <Func item={item} key={item.id} config={this.props.config} />;
        case 'table':
          return <Sheet item={item} key={item.id} config={this.props.config} />;
        default:
          return null;
      }
    }.bind(this));

    return (
      <div className={this.props.className + ' m-page m-page--container'}>
        {pageList}
      </div>
    );
  }
});

module.exports = PageList;
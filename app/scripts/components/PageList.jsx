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
          return <Note item={item} key={item.id} />;
        case 'function':
          return <Func item={item} key={item.id} />;
        case 'table':
          return <Sheet item={item} key={item.id} />;
        default:
          return null;
      }
    });
    return (
      <div className={this.props.className + ' row'}>
        {pageList}
      </div>
    );
  }
});

module.exports = PageList;
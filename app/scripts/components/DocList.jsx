/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var DocItem = require('./DocItem.jsx');

var DocList = React.createClass({
  mixins: [FluxChildMixin],

  handleClick: function (id) {
    console.log('list', id)

    // TODO: make this actually load a doc/pages!
  },

  render: function () {
    // console.log('docs:', this.props.docs)
    if (this.props.docs) {
      var docLines = this.props.docs.map(function (doc, index) {
        return <DocItem doc={doc} key={index+1} onClick={this.handleClick} />
      }.bind(this));
    }
    return (
      <div className="row m-doc m-doc--container col-md-12">
        <h3 className="row m-doc--hed">Doc List</h3>
        <ul className="row m-doc--row">
          {this.props.docs ? docLines : <p>No docs (yet).</p>}
        </ul>
      </div>
    );
  }
});

module.exports = DocList;
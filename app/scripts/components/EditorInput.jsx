/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

window.CodeMirror = require('codemirror/lib/codemirror.js');
// var Firebase = require('firebase-client');
// var Firepad = require('firepad/dist/firepad.js');
var ModeJavascript = require('codemirror/mode/javascript/javascript.js');
var ModeMathr = require('../modes/mathr.js');

/**
 * RTE Views
 */
var EditorInput = React.createClass({
  input: null,

  gutterClick: function (instance, line, gutter, clickEvent) {
    var key = 'l_' + this.props.key + '_' + (line + 1);
    location.hash = key;
    // console.log('gutterClick', key, instance)
  },

  handleChange: function (cm, change) { // d, t, e
    // console.log(cm, change)
    this.input = cm.doc.getValue();
    // console.log(this.input)
    if (this.input !== this.props.input) {
      this.props.onInputUpdate(this.input, change);
    }
  },

  installRTE: function () {
    // TODO:
    // - add more config options http://codemirror.net/doc/manual.html
    // - move common to __config, merge __config object with this

    var el = this.getDOMNode().children[0];

    // this.dbRef = new Firebase(window.__config.firebaseHost + '/firepads/EditorInput/' + this.props.key);
    // console.log(this.props)
    this.rte = window.CodeMirror.fromTextArea(el, {
      mode: (this.props.mode === 'function' ? 'javascript' : 'mathr'),
      theme: this.props.darkTheme ? 'monokai' : 'default',
      lineNumbers: true,
      lineWrapping: true,
      value: this.props.input ? this.props.input : null
    });
    // this.firepad = Firepad.fromCodeMirror(this.dbRef, this.rte, {
    //   // userId: blah,
    //   richTextShortcuts: false,
    //   richTextToolbar: false
    // });
    // console.log(this.rte)
    // console.log(this.firepad)
    // this.firepad.setUserId();

    // if (this.props.input) {
    //   // TODO Switch the input to lines/array instead?
    //   this.rte.doc.setValue(this.props.input);
    // }

    setTimeout(function () {
      // it needs time to init
      // TODO: use a callback below instead
      // this.props.onInputUpdate(this.props.input);
    }.bind(this), 1);

    this.rte.on('changes', this.handleChange);
    this.rte.on('gutterClick', this.gutterClick);
  },

  componentDidMount: function () {
    // console.log(this.props.input);
    if (!this.rte) {
      this.installRTE();
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (!this.rte) {
      this.installRTE();
    }
    if (nextProps.input !== this.input) {
      // TODO: do this only sparingly under certain conditions
      // this might have been updated from the editor itself.
      this.rte.doc.setValue(nextProps.input);
    }
    if (typeof nextProps.darkTheme !== 'undefined') {
      this.rte.setOption('theme', nextProps.darkTheme ? 'monokai' : 'default');
    }
  },

  render: function () {
    return (
      <div className={this.props.className + ' editor m-note--input'}><textarea /></div>
    );
  }
});

module.exports = EditorInput;
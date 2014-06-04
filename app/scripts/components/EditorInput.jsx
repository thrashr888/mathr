/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');

var CodeMirror = require('codemirror/lib/codemirror.js');

/**
 * RTE Views
 */
var EditorInput = React.createClass({
  input: null,

  resizeContainer: function () {
    // if (this.rte && this.rte.editor.renderer) {
    //   var $container = this.rte.editor.renderer.container;
    //   $container.style.height = this.rte.root.clientHeight + 'px';
    // }
  },
  editorUpdated: function (cm, change) { // d, t, e
    // console.log(cm, change)
    // console.log([d, t, e]);
    this.input = cm.doc.getValue();
    // console.log(this.input)
    if (this.input !== this.props.input) {
      this.props.onInputUpdate(this.input);
    }
    this.resizeContainer();
  },
  installRTE: function () {

    // TODO:
    // - add more config options http://codemirror.net/doc/manual.html
    // - move common to __config
    // - merge __config object with this
    this.rte = CodeMirror.fromTextArea(this.getDOMNode().children[0], {
      mode: 'text/plain',
      theme: 'monokai',
      value: this.props.input ? this.props.input : ''
    });

    console.log(this.rte)

    this.resizeContainer();

    setTimeout(function () {
      // it needs time to init
      // TODO: use a callback below instead
      this.resizeContainer();
      // this.props.onInputUpdate(this.props.input);
    }.bind(this), 1);

    this.rte
      .on('changes', this.editorUpdated);
    // this.rte
    //   .on('renderer-update', this.editorUpdated)
    //   .on('text-change', this.editorUpdated)
    //   .on('pre-event', function () { // d, t, e
    //     // console.log('pe', d, t, e);
    //   }.bind(this));
  },
  componentDidMount: function () {
    // console.log(this.props.input);
    if (!this.rte) {
      this.installRTE();
      this.resizeContainer();
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (!this.rte) {
      this.installRTE();
    }
    if (nextProps.input !== this.input) {
      // this.rte.setContents({ text: nextProps.input });
      // TODO: do this only sparingly under certain conditions
      // this might have been updated from the editor itself.
      this.rte.setHTML(nextProps.input);
      // this.rte.insertText(0, nextProps.input);
      this.resizeContainer();
    }
  },
  render: function () {
    return (
      <div className="editor col-md-6 col-xs-6 m-note--input"><textarea /></div>
    );
  }
});

module.exports = EditorInput;
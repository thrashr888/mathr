/**
 * @jsx React.DOM
 */

'use strict';

var Quill = require('../../../node_modules/quilljs/index.js');

/**
 * RTE Views
 */
var EditorInput = React.createClass({
  input: null,

  resizeContainer: function () {
    if (this.rte && this.rte.editor.renderer) {
      var $container = this.rte.editor.renderer.container;
      $container.style.height = this.rte.root.clientHeight + 'px';
    }
  },
  editorUpdated: function (d, t, e) { // d, t, e
    // console.log([d, t, e]);
    this.input = this.rte.getText();
    // console.log(this.input)
    if (this.input !== this.props.input) {
      this.props.onInputUpdate(this.input);
    }
    this.resizeContainer();
  },
  installRTE: function () {

    // TODO: switch to code mirror?
    // - free gutter
    // - free syntax formatting?
    // - dont need RTE features anyway

    this.rte = new Quill(this.getDOMNode(), __config.quillSetup);

    if (this.props.input) {


      // TODO Switch the input to lines/array instead?


      // this.rte.setContents([
      //   { value: this.props.input },
      //   { value: '' }
      // ]);
      this.rte.setHTML(this.props.input);
      // this.rte.insertText(0, this.props.input);
    }
    this.resizeContainer();

    setTimeout(function () {
      // it needs time to init
      // TODO: use a callback below instead
      this.resizeContainer();
      // this.props.onInputUpdate(this.props.input);
    }.bind(this), 1);

    this.rte
      .on('renderer-update', this.editorUpdated)
      .on('text-change', this.editorUpdated)
      .on('pre-event', function () { // d, t, e
        // console.log('pe', d, t, e);
      }.bind(this));
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
      <div className="editor col-md-6 col-xs-6 m-note--input"></div>
    );
  }
});

module.exports = EditorInput;
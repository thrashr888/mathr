/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/react.js');
var Fluxxor = require('fluxxor/index.js');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);

var Gutter = require('./Gutter.jsx');
var EditorInput = require('./EditorInput.jsx');
var EditorOutput = require('./EditorOutput.jsx');

var funcs = {};

/**
 * Notes View
 */
var Note = React.createClass({
  mixins: [FluxChildMixin],

  funcs: {},

  flattenTables: function () {
    var flux = this.getFlux();
    // console.log(flux)
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    var tables = (flux.store('PageStore').getState().pages).filter(function (i) {
      return i.type === 'table';
    }).map(function (i) {
      return i.input;
    });

    return tables;
  },

  flattenFuncs: function () {
    var flux = this.getFlux();
    // console.log(flux)
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    var tables = (flux.store('PageStore').getState().pages).filter(function (i) {
      return i.type === 'function';
    });

    return tables;
  },

  funcItemToFunction: function (item) {
    // var q = Q.defer();
    // console.log(item)
    // TODO: convert this into an actual, usable function:
    // "function multiplyList (v, m) {\n\tfor(var i in v) {\n\t\ti = i * m;\n\t};\n\treturn v;\n};"
    // then add this to the list of functions available to the compiler below

    // first thoughts:
    // ? namespace the function, ex.: functions.multiplyList
    // parse out "function XXX(XXX){XXX}"
    // read up on eval for JS
    // use the compiler?
    // console.log(item.name, item.input, this)


    // eval.apply(this, [item.input]);
    eval.call(this.funcs, item.input);

    // var func = eval(item.input);
    // console.log(item.name, item.input, this, window)
    // console.log(this.funcs, this)
    var name = eval(item.name);
    // console.log(this[item.name])
    // console.log(name)
    // TODO: switch to jsandbox here
    // jsandbox.eval({
    //   code: item.input,
    //   input: figure this out
    //   callback: function (x) {
    //     q.resolve(x);
    //   },
    //   onerror: function (e) {
    //     throw new Error(e);
    //   }
    // });
    // return q.promise;
    return name;
  },

  tableLookup: function (tables) {
    return function (symbol) {
      // console.log('table:', symbol, this, tables)
      var t = symbol.split('')[1] - 1;
      return tables[t]; // returns an array
    };
  },

  tablecellLookup: function (tables) {
    return function (symbol) {
      // console.log('tablecell:', symbol, this, tables)
      var cToI = 'abcdefghijklmnopqrstuvwxyz'.split(''),
        s = symbol.split(''),
        table = s[1] - 1,
        row = cToI.indexOf(s[3]); // char to int

      if(s[4]) {
        // get a cell
        var col = s[4] - 1;
        // console.log([symbol, table, row, col, tables[table][row][col]]);
        return tables[table][row][col]; // returns a value
      } else {
        // get a row
        // console.log([symbol, table, row, tables[table][row]]);
        return tables[table][row]; // returns an array
      }
    };
  },

  solveLines: function (rawCode) {

    // TODO: move this to the model

    // console.log(rawCode);
    function stripTags (string) {
      if (!string) {
        return '';
      }
      string = string.replace(/<\/p>/ig, '\n');
      string = string.replace(/(<([^>]+)>)/ig, '');
      return string;
    }

    var compiled = [],
      rendered = {},
      rerendered = [],
      code = rawCode;
    code = stripTags(code);
    var lines = code.split('\n');

    var tables = this.flattenTables();
    var funcs = this.flattenFuncs();

    rendered['t1.b1'] = 3; // just a test
    var extraFunctions = {};
    extraFunctions.table = this.tableLookup(tables);
    extraFunctions.tablecell = this.tablecellLookup(tables);

    funcs.forEach(function (func, i) {
      extraFunctions[func.name] = this.funcItemToFunction(func);
    }.bind(this));

    // console.log('extraFunctions', extraFunctions);

    return lines.map(function (line, i) {
      var compiled;
      try {
        compiled = compileExpression(line, extraFunctions);
        rendered['l' + (i + 1)] = compiled(rendered);
      } catch (e) {
        console.error(e);
        this.getFlux().actions.addError(e.toString());
        rendered['l' + (i + 1)] = compiled = '';
      }
      return compiled;
    }.bind(this)).map(function (line, i) {
      var rerendered;
      try {
        rerendered = this.normalizeString(line(rendered));
        rendered['l' + (i + 1)] = rerendered;
      } catch (e) {
        console.error(e);
        this.getFlux().actions.addError(e.toString());
        rendered['l' + (i + 1)] = rerendered = '';
      }
      return rerendered;
    }.bind(this));
  },

  normalizeString: function (string) {
    // just remove the currency output for now
    if (typeof string === 'string' && string.substr(0, 1) === '$') {
      return string.substr(1, string.length);
    } else {
      return string;
    }
  },

  handleInputUpdate: function (update) {
    // console.log('update:', update);
    // this.setState({
    //   input: update.input
    // });
    // this.setState({
    //   input: update.input,
    //   output: update.output
    // });
    // console.log(this.props.item.input, update)
    if (update && this.props.item.input !== update) {
      this.props.item.input = update;
      this.props.item.output = this.solveLines(update);
    }

    // this.setState();
    // console.log(update, this.props.item)
    if (!this.init) {
      // skip this on the first run
      this.getFlux().actions.updatePage(this.props.item);
    } else {
      this.init = false;
    }
  },
  componentDidMount: function () {
    this.init = true;
    this.props.item.output = this.solveLines(this.props.item.input);

    // FIXME: enable this but don't update this.props.item.input since that's what triggered this! that change rerenders the RTE and we lose our cursor.
    this.getFlux().actions.updatePage(this.props.item);
  },
  getInitialState: function() {
    return {};
  },
  render: function () {
    // console.log(this.props)
    // console.log(this.props.item.input.split('\n'))
    return (
      <div className="row m-note m-note--container col-md-12">
        <h3 className="row m-note--hed">{this.props.item ? this.props.item.name : ''}</h3>
        <div className="row m-note--row">
          <EditorInput input={this.props.item.input ? this.props.item.input : ''} onInputUpdate={this.handleInputUpdate} mode="note" key={this.props.item.id} className="col-md-7 col-xs-7" />
          <EditorOutput output={this.props.item.output ? this.props.item.output : ''} />
        </div>
      </div>
    );
  }
});

module.exports = Note;
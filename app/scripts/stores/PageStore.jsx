/**
 * @jsx React.DOM
 */
/*globals compileExpression, $*/
'use strict';

var Fluxxor = require('fluxxor/index.js');
var Firebase = require('firebase-client');
var uuid = require('node-uuid');

var PageStore = Fluxxor.createStore({
  actions: {
    'ADD_PAGE': 'onAddPage',
    'ADD_PAGES': 'onAddPages',
    'TOGGLE_PAGE': 'onTogglePage',
    'UPDATE_PAGE': 'onUpdatePage',
    'CLEAR_PAGES': 'onClearPages',
    'GET_PAGES': 'onGetPages'
  },

  initialize: function initialize() {
    this.dbRef = new Firebase(window.__config.firebaseHost + '/pages');

    this.pages = [];
  },

  _flattenTables: function _flattenTables() {
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    var tables = this.pages.filter(function (i) {
      return i.type === 'table';
    }).map(function (i) {
      return i.input;
    });

    return tables;
  },

  _flattenFuncs: function _flattenFuncs() {
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    var tables = this.pages.filter(function (i) {
      return i.type === 'function';
    });

    return tables;
  },

  _funcItemToFunction: function _funcItemToFunction(item) {
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

  _tableLookup: function _tableLookup(tables) {
    return function (symbol) {
      // console.log('table:', symbol, this, tables)
      var t = symbol.split('')[1] - 1;
      return tables[t]; // returns an array
    };
  },

  _tablecellLookup: function _tablecellLookup(tables) {
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

  _normalizeString: function _normalizeString(string) {
    // just remove the currency output for now
    if (typeof string === 'string' && string.substr(0, 1) === '$') {
      return string.substr(1, string.length);
    } else {
      return string;
    }
  },

  _stripTags: function _stripTags(string) {
    if (!string) {
      return '';
    }
    string = string.replace(/<\/p>/ig, '\n');
    string = string.replace(/(<([^>]+)>)/ig, '');
    return string;
  },

  solveLines: function solveLines(rawCode) {
    // console.log(rawCode);
    var rendered = {},
      code = this._stripTags(rawCode),
      lines = code.split('\n'),
      tables = this._flattenTables(),
      funcs = this._flattenFuncs(),
      extraFunctions = {};

    rendered['t1.b1'] = 3; // just a test
    extraFunctions.table = this._tableLookup(tables);
    extraFunctions.tablecell = this._tablecellLookup(tables);

    funcs.forEach(function (func, i) {
      extraFunctions[func.name] = this._funcItemToFunction(func);
    }.bind(this));
    // console.log('extraFunctions', extraFunctions);

    return lines.map(function (line, i) {
      var compiled;
      var lineKey = 'l' + (i + 1);
      if (line === '') {
        rendered[lineKey] = '';
        return function () { return ''; };
      }
      try {
        compiled = compileExpression(line, extraFunctions);
        var value = compiled(rendered);
        if (value) {
          rendered[lineKey] = compiled(rendered);
        } else if (!rendered[lineKey]) {
          rendered[lineKey] = '';
        }
      } catch (e) {
        console.error(e);
        compiled = function () { return ''; };
        if (!rendered[lineKey]) {
          rendered[lineKey] = '';
        }
        this.flux.actions.addError({message: e.toString()});
      }
      return compiled;
    }.bind(this)).map(function (line, i) {
      var rerendered;
      var lineKey = 'l' + (i + 1);
      try {
        rerendered = this._normalizeString(line(rendered));
        // console.log(rerendered)
        if (rerendered) {
          rendered[lineKey] = rerendered;
        } else if (!rendered[lineKey]) {
          rendered[lineKey] = '';
        }
      } catch (e) {
        console.error(e);
        if (!rendered[lineKey]) {
          rendered[lineKey] = rerendered = '';
        }
        this.flux.actions.addError({message: e.toString()});
      }
      return rerendered;
    }.bind(this));
  },

  onAddPage: function onAddPage(payload) {
    // console.log(payload)
    this.pages.push({
      id: payload.page.id || uuid.v4(),
      type: payload.page.type,
      order: payload.page.order,
      name: payload.page.name,
      input: payload.page.input,
      output: null,
      hidden: false,
      created: new Date().getTime()
    });
    this.emit('change');
  },

  onAddPages: function onAddPages(payload) {
    for (var i = 0, l = payload.pages.length; i < l; i++) {
      var page = payload.pages[i];
      this.pages.push({
        id: page.id || uuid.v4(),
        type: page.type,
        order: page.order,
        name: page.name,
        input: page.input,
        output: null,
        hidden: false,
        created: new Date().getTime()
      });
    }
    this.emit('change');
  },

  onTogglePage: function onTogglePage(payload) {
    payload.page.hidden = !payload.page.hidden;
    this.emit('change');
  },

  onUpdatePage: function onUpdatePage(payload) {
    this.pages.forEach(function (page, i) {
      if (page.id === payload.page.id) {
        if (payload.hasOutput) {
          payload.page.output = this.solveLines(payload.page.input);
        }
        payload.page.updated = new Date().getTime();
        $.extend(page, payload.page);
      }
    }.bind(this));
    this.emit('change');
  },

  onClearPages: function onClearPages() {
    this.pages = this.pages.filter(function(page) {
      return page.hidden;
    });
    this.emit('change');
  },

  onGetPages: function onGetPages(payload) {
    // TODO: replace me with a better store
    $.ajax({
      url: payload.url,
      dataType: 'json',
      success: function(res) {
        // this.setState({pages: pages});
        this.onAddPages({pages: res.pages});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(payload.url, status, err.toString());
      }.bind(this)
    });
  },

  getState: function getState() {
    return {
      pages: this.pages
    };
  }
});

module.exports = PageStore;
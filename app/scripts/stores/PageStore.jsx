/**
 * @jsx React.DOM
 */
/*globals compileExpression, $*/
'use strict';

var Fluxxor = require('fluxxor/index.js');
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

  initialize: function() {
    this.pages = [];
  },

  flattenTables: function () {
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    var tables = this.pages.filter(function (i) {
      return i.type === 'table';
    }).map(function (i) {
      return i.input;
    });

    return tables;
  },

  flattenFuncs: function () {
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    var tables = this.pages.filter(function (i) {
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

  normalizeString: function (string) {
    // just remove the currency output for now
    if (typeof string === 'string' && string.substr(0, 1) === '$') {
      return string.substr(1, string.length);
    } else {
      return string;
    }
  },

  stripTags: function (string) {
    if (!string) {
      return '';
    }
    string = string.replace(/<\/p>/ig, '\n');
    string = string.replace(/(<([^>]+)>)/ig, '');
    return string;
  },

  solveLines: function (rawCode) {
    // console.log(rawCode);
    var rendered = {},
      code = this.stripTags(rawCode),
      lines = code.split('\n'),
      tables = this.flattenTables(),
      funcs = this.flattenFuncs(),
      extraFunctions = {};

    rendered['t1.b1'] = 3; // just a test
    extraFunctions.table = this.tableLookup(tables);
    extraFunctions.tablecell = this.tablecellLookup(tables);

    funcs.forEach(function (func, i) {
      extraFunctions[func.name] = this.funcItemToFunction(func);
    }.bind(this));
    // console.log('extraFunctions', extraFunctions);

    return lines.map(function (line, i) {
      var compiled;
      if (line === '') {
        rendered['l' + (i + 1)] = '';
        return function () { return ''; };
      }
      try {
        compiled = compileExpression(line, extraFunctions);
        rendered['l' + (i + 1)] = compiled(rendered);
      } catch (e) {
        console.error(e);
        compiled = function () { return ''; };
        rendered['l' + (i + 1)] = '';

        // this.waitFor(['ErrorStore'], function(errorStore) {
        //   errorStore.onAddError({message: e.toString()});
        // });
      }
      return compiled;
    }.bind(this)).map(function (line, i) {
      var rerendered;
      try {
        rerendered = this.normalizeString(line(rendered));
        // console.log(rerendered)
        rendered['l' + (i + 1)] = rerendered;
      } catch (e) {
        console.error(e);
        rendered['l' + (i + 1)] = rerendered = '';

        // this.waitFor(['ErrorStore'], function(errorStore) {
        //   errorStore.onAddError({message: e.toString()});
        // });
      }
      return rerendered;
    }.bind(this));
  },

  onAddPage: function(payload) {
    // console.log(payload)
    this.pages.push({
      id: payload.page.id || uuid.v4(),
      type: payload.page.type,
      name: payload.page.name,
      input: payload.page.input,
      output: null,
      hidden: false
    });
    this.emit('change');
  },

  onAddPages: function(payload) {
    for (var i = 0, l = payload.pages.length; i < l; i++) {
      var page = payload.pages[i];
      this.pages.push({
        id: page.id || uuid.v4(),
        type: page.type,
        name: page.name,
        input: page.input,
        output: null,
        hidden: false
      });
    }
    this.emit('change');
  },

  onTogglePage: function(payload) {
    payload.page.hidden = !payload.page.hidden;
    this.emit('change');
  },

  onUpdatePage: function(payload) {
    this.pages.forEach(function (page, i) {
      if (page.id === payload.page.id) {
        payload.page.output = this.solveLines(payload.page.input);
        $.extend(page, payload.page);
      }
    }.bind(this));
    this.emit('change');
  },

  onClearPages: function() {
    this.pages = this.pages.filter(function(page) {
      return page.hidden;
    });
    this.emit('change');
  },

  onGetPages: function(payload) {
    // TODO: replace me with a better store
    $.ajax({
      url: payload.url,
      dataType: 'json',
      success: function(doc) {
        // this.setState({pages: pages});
        this.onAddPages({pages: doc.pages});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(payload.url, status, err.toString());
      }.bind(this)
    });
  },

  getState: function() {
    return {
      pages: this.pages
    };
  }
});

module.exports = PageStore;
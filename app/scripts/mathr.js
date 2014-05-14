/* globals numeral, $*/
'use strict';

// mathr object used in the parser
window.mathr = {

  // yytext, yyleng, yylineno, yy,
  // yystate /* action[1] */,
  // $$ /* vstack */,
  // _$ /* lstack */

  lines: [],
  lineStack: [],

  currenciesMatch: /^([\$€£])([0-9,]+\.?[0-9]*)$/,
  currenciesUnpaddedMatch: /^([\$€£])([0-9,]+)$/,
  numberUnpaddedMatch: /^([0-9,]+)$/,
  functionMatch: /^([\w_$]+)\(([\w\d\s_\$,]+)\)$/,
  tableMatch: /^t([0-9]+)\.?([a-z]+?)([0-9]+?)$/,
  lineMatch: /^l([0-9]+)$/,

  numberFormat: '0,0.[00]',
  currencyFormat: '$0,0.[00]',

  functionStack: {
    'random': function (v) {
      return Math.random(v);
    }
  },

  reset: function () {
    this.lineStack = [];
  },

  wrapNumeral: function (input) {
    // console.log(typeof input);
    var out;
    if (typeof input !== 'string' || typeof input !== 'number') {
      // already wrapped
      return input;
    }

    /*

    TODO:
    - add other types (line, cell, func)
    - pass all input through this

    - stop formatting everywhere
    - format in solve()
      - add value to data-value

    */

    if (input.match(this.currenciesUnpaddedMatch))
    {
      out = numeral(input + '.00').format(this.currencyFormat);
      out.__isCurrency = true;
    }
    else if (input.match(this.currenciesMatch))
    {
      out = numeral(input).format(this.currencyFormat);
      out.__isCurrency = true;
    }
    else if (input.match(this.numberUnpaddedMatch))
    {
      out = numeral(input + '.00').format(this.numberFormat);
    }
    else
    {
      out = numeral(input).format(this.numberFormat);
    }
    return out;
  },

  getLineVal: function (line) {
    var out = $('div.row div[data-output=' + line.replace('l', '') + ']').html();
    // console.log('getLine', line, out);
    return this.wrapNumeral(out) || '';
  },

  getTable: function (query) {
    var l = query.match(this.tableMatch);
    var table = l[1];
    // <table data-table="1" class="table">
    return $('div.row table[data-table=' + table + ']').html();
  },

  getCellVal: function (query) {
    var l = query.match(this.tableMatch);
    var table = l[1],
        column = l[2],
        row = l[3];
    // console.log(l);
    // <table data-table="1" class="table">
    // <tr data-row="1"><td data-col="1">coffee</td> <td data-col="2">$4.00</td></tr>
    // self.tables[table][row][column];
    var out = $('div.row table[data-table=' + table + '] tr[data-row=' + row + '] td[data-col=' + column + ']').html();
    return this.wrapNumeral(out) || '';
  },

  opFunc: function (t1) {
    // console.log('opFunc', t1, args);
    var func = t1.match(this.functionMatch);
    if (!this.functionStack[func[1]]) {
      return 'n/a';
    }
    var result = this.functionStack[func[1]].apply(func[2]);
    return result;
  },

  e: function (e) {
    this.lineStack.push(e);
    return this.lineStack;
  },

  opCurr: function ($1, $2, $3) {
    console.log('opCurr', [$1, $2, $3]);
    var output = null,
        $1b = numeral($1),
        $3b = numeral($3);
    console.log('opCurr', [$1b, $2, $3b]);

    switch ($2) {
      case '/':
        output = $1b.divide($3b);
        break;
      case '*':
        output = $1b.multiply($3b);
        break;
      case '+':
        output = $1b.add($3b);
        break;
      case '-':
        output = $1b.subtract($3b);
        break;
      default:
        output = $1b.multiply($3b);
        break;
    }

    // return numeral(output).format('$0,0.00');
    console.log('opCurr', output, [$1b, $2, $3b]);

    if ($1b.match(this.currenciesMatch) || $3b.match(this.currenciesMatch)) {
      return output.format(this.currencyFormat);
    } else {
      return output.format(this.numberFormat);
    }
  },

  opLine: function ($1, $2, $3) {
    // console.log('opLine', [$1, $2, $3]);
    var output = null,
        $1b = this.getLineVal($1),
        $1c = numeral($1b);

    switch ($2) {
      case '/':
        output = $1c.divide($3);
        break;
      case '*':
        output = $1c.multiply($3);
        break;
      case '+':
        output = $1c.add($3);
        break;
      case '-':
        output = $1c.subtract($3);
        break;
      default:
        output = $1c;
        break;
    }

    if ($1b.match(this.currenciesMatch)) {
      return numeral(output).format(this.currencyFormat);
    } else {
      return numeral(output).format(this.numberFormat);
    }
  }
};


// Numeral setup
numeral.fn.pow = function (value) {
  function cback(accum, curr) { // accum, curr, currI, O
    return Math.pow(curr * this.correctionFactor(accum, curr));
  }
  this._value = [this._value, value].reduce(cback, 1);
  return this;
}.bind(numeral.fn);

numeral.fn.match = function (inputRegex) {
  // console.log(this._value, this);
  return ('' + this._value).match(inputRegex);
}.bind(numeral.fn);

numeral.defaultFormat(window.mathr.numberFormat);

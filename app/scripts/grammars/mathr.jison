/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%%
\n+                   return 'NEWLINE'
\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER';
"*"                   return '*';
"/"                   return '/';
"-"                   return '-';
"+"                   return '+';
"^"                   return '^';
"("                   return '(';
")"                   return ')';
"PI"                  return 'PI';
"E"                   return 'E';
^"#".+                return 'COMMENT';
<<EOF>>               return 'EOF';

([\w]+)"("([\w\d]+)")"        return 'FUNCTION';
"t"([0-9]+)"."[a-z]+?[0-9]+?  return 'TABLECELL';
"t"([0-9]+)                   return 'TABLE';
"l"([0-9]+)                   return 'LINE';
([\w]+)":"                    return 'LABEL';
([\w]+)                       return 'TEXT';
([$€£])[0-9]+("."[0-9]+)?\b   return 'CURRENCY';

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { mathr.reset(); return $1; }
    | calc EOF
        { mathr.reset(); return $1 }
    ;

e
    : e e
        {$$ = $1 + ' ' + $2;}
    | e '+' e
        {$$ = numeral($1).add(numeral($3)).format(mathr.numberFormat);}
    | e '-' e
        {$$ = numeral($1).subtract(numeral($3)).format(mathr.numberFormat);}
    | e '*' e
        {$$ = numeral($1).multiply(numeral($3)).format(mathr.numberFormat);}
    | e '/' e
        {$$ = numeral($1).divide(numeral($3)).format(mathr.numberFormat);}
    | e '%'
        {$$ = $1/100;}
    | e '^' e
        {$$ = numeral($1).pow($3).format(mathr.numberFormat);}
    | e '!'
        {$$ = (function fact (n) { return n==0 ? 1 : fact(n-1) * n })($1);}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = numeral($1).format(mathr.numberFormat); $$.__isNumber = true;}
    | E
        {$$ = numeral(Math.E).format(mathr.numberFormat); $$.__isNumber = true;}
    | PI
        {$$ = numeral(Math.PI).format(mathr.numberFormat); $$.__isNumber = true;}
    | TABLE
        {$$ = "*" + $1 + "*";}
    | FUNCTION
        {$$ = mathr.opFunc($1, arguments); $$.__isFunction = true;}
    | LINE
        {$$ = mathr.getLineVal($1); $$.__isLine = true;}
    | LABEL
        {$$ = '<b>' + $1 + '</b> '; $$.__isText = true;}
    | TEXT
        {$$ = $1; $$.__isText = true;}
    | COMMENT
        {$$ = '<em>' + $1 + '</em> '; $$.__isText = true;}
    | CURRENCY
        {$$ = numeral($1).format(mathr.currencyFormat); $$.__isCurrency = true;}
    | TABLECELL
        {$$ = mathr.getCellVal($1); $$.__isTableCell = true;}
    ;

calc
    : e
        { $$ = mathr.e($1); }
    | calc NEWLINE e
        { $1.push($3); $$ = $1 }
    | calc
        { $1.push($2); $$ = $1 }
    | calc NEWLINE
        { $$ = $1.join('<br>\n'); }
    | calc EOF
        { $$ = $1.join('<br>\n'); }
    ;

Whitespace
  : COMMENT
        {$$ = '<em>' + $1 + '</em> '; $$.__isText = true;}
  | NEWLINE
        {$$ = $1; return $1;}
  ;

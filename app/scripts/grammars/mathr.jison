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
^"#".+                return 'COMMENT'
<<EOF>>               return 'EOF';

([\w]+)"("([\w\d]+)")"      return 'FUNCTION';
"t"([0-9]+)"."[a-z]+[0-9]+  return 'TABLECELL';
"t"([0-9]+)                 return 'TABLE';
"l"([0-9]+)                 return 'LINE';
([\w]+)":"                  return 'LABEL';
([\w]+)                     return 'TEXT';
([$€£])[0-9]+("."[0-9]+)?\b return 'CURRENCY';

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
    : e '+' e
        {$$ = $1+$3;}
    | e '-' e
        {$$ = $1-$3;}
    | e '*' e
        {$$ = $1*$3;}
    | e '/' e
        {$$ = $1/$3;}
    | e '%'
        {$$ = $1/100;}
    | e '^' e
        {$$ = Math.pow($1, $3);}
    | e '!'
        {{
          $$ = (function fact (n) { return n==0 ? 1 : fact(n-1) * n })($1);
        }}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = Number(yytext);}
    | E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | TABLE
        {$$ = "*" + $1 + "*";}
    | FUNCTION
        {$$ = mathr.opFunc($1, arguments);}
    | LINE
        {$$ = "<em>" + mathr.getLineVal($1) + "</em>";}
    | LINE "+" e
        {$$ = mathr.opLine($1, $2, $3);}
    | LINE "-" e
        {$$ = mathr.opLine($1, $2, $3);}
    | LINE "*" e
        {$$ = mathr.opLine($1, $2, $3);}
    | LINE "/" e
        {$$ = mathr.opLine($1, $2, $3);}
    | LABEL
        {$$ = '<b>' + $1 + '</b> ';}
    | LABEL e
        {$$ = '<b>' + $1 + '</b> ' + $2;}
    | TEXT e
        {$$ = $1 + ' ' + $2;}
    | e TEXT
        {$$ = $1 + ' ' + $2;}
    | NUMBER TEXT
        {$$ = $1 + ' ' + $2;}
    | TEXT NUMBER
        {$$ = $1 + ' ' + $2;}
    | CURRENCY
        {$$ = "$" + yytext;}
    | CURRENCY "+" e
        {$$ = mathr.opCurr($1, $2, $3, arguments);}
    | CURRENCY "-" e
        {$$ = mathr.opCurr($1, $2, $3, arguments);}
    | CURRENCY "*" e
        {$$ = numeral($1).multiply($3).format('$0,0.00');}
    | CURRENCY "/" e
        {$$ = numeral($1).divide($3).format('$0,0.00');}
    | TABLECELL
        {$$ = "cell:[" + $1 + "]";}
    ;

calc
    : e
        { $$ = mathr.e($1); }
    | calc NEWLINE e
        { $1.push($3); $$ = $1 }
    | calc NEWLINE
        { $$ = $1 }
    ;

Whitespace
  : COMMENT
        {return $1;}
  ;

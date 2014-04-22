/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%%
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
<<EOF>>               return 'EOF';

"t"([0-9]+)"."[a-z]+[0-9]+  return 'TABLECELL';
"t"([0-9]+)                 return 'TABLE';
"l"([0-9]+)                 return 'LINE';
([\w]+)":"                  return 'LABEL';
([\w]+)"("([\w]+)")"        return 'FUNCTION';
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
        {print($1); return $1;}
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
    | e '^' e
        {$$ = Math.pow($1, $3);}
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
        {$$ = mathr.opFunc($1);}
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
        {$$ = console.log($1); return $1;}
    | LABEL e
        {$$ = '<b>' + $1 + '</b> ' + $2;}
    | TEXT e
        {$$ = $1 + ' ' + $2;}
    | e TEXT
        {$$ = $1 + ' ' + $2;}
    | NUMBER TEXT
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

# Mathr Examples and Use Case Testing

__NOTE:__ This is mostly a spec at this point. I have jison wired up to parse some sample text, but that's it so far.

The idea is to have a reactive notes app that can do math for you using data tables and maybe some python-like functions.

- .txt or .md format
- workflow like Quip?
- should feel like soulver but with table data + functions
- more functional like Calca
- live data tables, importable from .csv, Google Docs, .xls
- custom syntax
- custom JS parser or just use python?
- kind of like iPython 2.0?
  - http://nbviewer.ipython.org/github/ipython/ipython/blob/2.x/examples/Interactive%20Widgets/Using%20Interact.ipynb
  - http://nbviewer.ipython.org/github/minad/iruby/blob/master/IRuby-Example.ipynb
- mongodb or redis?
- markdown?
- enable "-" todos like Taskpaper?
- sync with Dropbox
- collaboration tools (wiki or OT/sync.js style?) like Google Docs

## Example from Soulver

    month: 31 d × 24 hrs
    term: 36 mo heavy utilization
    AWS Reserved Pricing: (CPUs, ECU, Mem GiB, Storage GB)
    SPOT m1.xlarge (4/8/15/4x420): monthly cost is 744 × $0.0521 per month
    m1.large (2/4/7.5/2x420): monthly cost is 744 × $0.034 per hr + ($750 upfront / 744) per mth
    SPOT m1.large (2/4/7.5/2x420): monthly cost is 744 × $0.0261 per month
    m1.medium (1/2/3.75/410): monthly cost is 744 × $0.017 per hr + ($375 upfront / 744) per mth

## Embedded Databases/Spreadsheets

- importable
- can get live/realtime data from json or google docs
- `*` signifies the "slug" field

    ┌---------------------------------------------------------------------------------┐
    |                                 t1 ECU Sizes                                    |
    ├-------------------------------------------------------------------------------┬-┤
    | | A         | B   | C   | D       | E           | F          | G       | H    | |
    | | *Size     | CPU | ECU | Mem GiB | Storage GiB | V Price Hr | Upfront | Type |+|
    |1| m1.xlarge |   4 |   8 |      15 |       4x420 |    $0.0521 |      $0 | SPOT | |
    |2| m1.large  |   2 |   4 |     7.5 |       2x420 |     $0.034 |    $750 | reg  | |
    |3| m1.large  |   2 |   4 |     7.5 |       2x420 |    $0.0261 |      $0 | SPOT | |
    |4| m1.medium |   1 |   2 |    3.75 |         410 |     $0.017 |    $375 | reg  | |
    |+|           |     |     |         |             |            |         |      | |
    └-------------------------------------------------------------------------------┴-┘

## Embedded Functions

- python?
- works on data values, numbers, strings
- would need to consider functional vs. OO
- functional might work better on this kind of data

Example function:

    ┌-------------------------------┐
    |        f1 multiply_list       |
    ├-------------------------------┤
    |1|def multiply_list(v, m):     |
    |2|  for i in v:                |
    |3|    i = i * m                |
    |4|  return v                   |
    |5|                             |
    └-------------------------------┘

## Spreadsheet Query Language

- copied from python + Google Docs
- needs more investigation

Some syntax ideas:

    t1.A1:B1
    multiply(t1.F1:F3, 13)
    t1.Size.1
    t1.1.Size
    t1['m1.xlarge']['Size']
    ['ECU Sizes']['m1.xlarge']['Size']
    ECU Sizes m1.xlarge Size
    ECU Sizes|m1.xlarge|Size
    ECU Sizes!m1.xlarge!Size
    Google docs style: "='Sheet number two'!B4"

Can apply filters:

    t1.F X month | < $20

## Live output from queries on every line

This is from `t1.F X month | < $20`:

    ┌-----------------------------------┐
    | t1 ECU Sizes | t1.F X month < $20 |
    |-----------------------------------|
    | | F                               |
    | |                        Price Hr |
    |3|                        $19.4184 |
    |4|                          $13.15 |
    └-----------------------------------┘

## Live output can also result in single values

Output should look more like soulver with the results to the right of every line:

    t1.F.1 X month # $38.7624


# Installation & Runtime

    > npm install && bower install
    > grunt serve


# The MIT License (MIT)

Copyright (c) 2014 Paul Thrasher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

# odata-query-parser

A highly versatile and fast OData Version 4.01 Parser which support almost all the available system query options like $filter, $orderby, $skip, $top, $count.
The [Open Data Protocol (OData)](https://www.odata.org/) enables the creation of REST-based data services which allow resources, identified using Uniform Resource Locators (URLs) and defined in a data model.
The Parser on high level works on lexer scanner strategy.

## How to build

To run the parser in local, please clone the repository and follow the below steps:

```JavaScript
npm install
npm run parser
```

To test and for test coverage:

```JavaScript
npm test
npm run test:report
```

## How to use

```JavaScript
import { parseFilter, parseOrderby, parseSkip, parseTop } from '@slackbyte/odata-query-parser';
const filter = "Price gt 20 or Rating ge 10 not (Name eq 'uday singh' and City in ('Redmond', 'London'))"
console.log(parseFilter(filter));
```

Output:

```JavaScript
{
  token: [
    { tokenType: 'conditionMemberExp', subType: '', value: 'Price' },
    { tokenType: 'comOperatorExp', subType: 'greaterThanExp', value: '>'},
    { tokenType: 'conditionMemberExp', subType: '', value: '20' },
    { tokenType: 'logOperatorExp', subType: 'orExp', value: 'OR' },
    { tokenType: 'conditionMemberExp', subType: '', value: 'Rating' },
    { tokenType: 'comOperatorExp', subType: 'greaterThanEqualToExp', value: '>='},
    { tokenType: 'conditionMemberExp', subType: '', value: '10' },
    { tokenType: 'logOperatorExp', subType: 'notExp', value: 'NOT' },
    { tokenType: 'groupOperatorExp', subType: 'openBracExp', value: '('},
    { tokenType: 'conditionMemberExp', subType: '', value: 'Name' },
    { tokenType: 'comOperatorExp', subType: 'equalToExp', value: '=' },
    { tokenType: 'conditionMemberExp', subType: '', value: "'uday singh'"},
    { tokenType: 'logOperatorExp', subType: 'andExp', value: 'AND' },
    { tokenType: 'conditionMemberExp', subType: '', value: 'City' },
    { tokenType: 'comOperatorExp', subType: 'inExp', value: 'in' },
    { tokenType: 'conditionMemberExp', subType: '', value: "('Redmond', 'London')"},
    { tokenType: 'groupOperatorExp', subType: 'closeBracExp', value: ')'}
  ]
}
```

## Support Features

-   [x] $count
-   [x] $filter
    -   [x] Comparison Operators
        -   [x] eq
        -   [x] ne
        -   [x] lt
        -   [x] le
        -   [x] gt
        -   [x] ge
        -   [x] has
        -   [x] in
    -   [x] Logical Operators
        -   [x] and
        -   [x] or
        -   [x] not
    -   [x] Arithmetic Operators
        -   [x] add
        -   [x] sub
        -   [x] mul
        -   [x] div
        -   [ ] divby
        -   [x] mod
    -   [x] String Functions
        -   [x] indexof
        -   [x] contains
        -   [x] endswith
        -   [x] startswith
        -   [x] length
        -   [x] substring
        -   [x] tolower
        -   [x] toupper
        -   [x] trim
        -   [x] concat
    -   [x] Date Functions
        -   [x] year
        -   [x] month
        -   [x] day
        -   [x] hour
        -   [x] minute
        -   [x] second
        -   [x] fractionalseconds
        -   [x] date
        -   [x] time
        -   [x] totaloffsetminutes
        -   [x] now
        -   [x] mindatetime
        -   [x] maxdatetime
    -   [x] Math Functions
        -   [x] round
        -   [x] floor
        -   [x] ceiling
    -   [x] Type and conditional Functions
        -   [x] cast
        -   [x] isof
        -   [x] case
-   [ ] $select
-   [x] $top
-   [x] $skip
-   [x] $orderby

## CONTRIBUTING

I love your inputs! and I want to make your contribution to this project easy and transparent, whether it's:

-   Reporting a bug
-   Discussing the current state of the code
-   Submitting a fix
-   Proposing new features

Please raise a pull request. 😊

Made with love in INDIA. ❤️

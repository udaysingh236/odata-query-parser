import { IOdataFilterToken } from './parser';
import { constants } from './utils/constants';

export const operatorLexer: Record<string, (sourceStr?: string, index?: number, tillNowStr?: string) => IOdataFilterToken> = {
    // Comparison Operators
    eq: function () {
        return {
            tokenType: 'comOperatorExp',
            subType: 'equalToExp',
            value: '=',
        };
    },
    ne: function () {
        return {
            tokenType: 'comOperatorExp',
            subType: 'notEqualToExp',
            value: '<>',
        };
    },
    gt: function () {
        return {
            tokenType: 'comOperatorExp',
            subType: 'greaterThanExp',
            value: '>',
        };
    },
    ge: function () {
        return {
            tokenType: 'comOperatorExp',
            subType: 'greaterThanEqualToExp',
            value: '>=',
        };
    },
    lt: function () {
        return {
            tokenType: 'comOperatorExp',
            subType: 'lessThanExp',
            value: '<',
        };
    },
    le: function () {
        return {
            tokenType: 'comOperatorExp',
            subType: 'lessThanEqualToExp',
            value: '<=',
        };
    },
    in: function () {
        return {
            tokenType: 'comOperatorExp',
            subType: 'inExp',
            value: 'in',
        };
    },

    // Logical Operators

    and: function () {
        return {
            tokenType: 'logOperatorExp',
            subType: 'andExp',
            value: 'AND',
        };
    },
    or: function () {
        return {
            tokenType: 'logOperatorExp',
            subType: 'orExp',
            value: 'OR',
        };
    },
    not: function () {
        return {
            tokenType: 'logOperatorExp',
            subType: 'notExp',
            value: 'NOT',
        };
    },

    // Arithmetic Operators

    add: function () {
        return {
            tokenType: 'ArithOperatorExp',
            subType: 'addExp',
            value: '+',
        };
    },
    sub: function () {
        return {
            tokenType: 'ArithOperatorExp',
            subType: 'subExp',
            value: '-',
        };
    },
    mul: function () {
        return {
            tokenType: 'ArithOperatorExp',
            subType: 'mulExp',
            value: '*',
        };
    },
    div: function () {
        return {
            tokenType: 'ArithOperatorExp',
            subType: 'divExp',
            value: '/',
        };
    },
    mod: function () {
        return {
            tokenType: 'ArithOperatorExp',
            subType: 'modExp',
            value: '%',
        };
    },
};

export const conditionLexer = {
    conditionMemberExp: 'conditionMemberExp',
};

// Grouping Operator
export function groupingLexer(ele: string): IOdataFilterToken {
    if (ele === constants.OPENING_BRACKET) {
        return {
            tokenType: 'groupOperatorExp',
            subType: 'openBracExp',
            value: '(',
        };
    } else if (ele === constants.CLOSING_BRACKET) {
        return {
            tokenType: 'groupOperatorExp',
            subType: 'closeBracExp',
            value: ')',
        };
    } else {
        throw new Error('Not a valid grouping operator');
    }
}

// Query Functions
export const queryFuncLexer: Record<string, (funcArgs: string) => IOdataFilterToken> = {
    concat: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'concatFuncExp',
            value: 'concat',
            funcArgs: funcArgs,
        };
    },
    contains: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'containsFuncExp',
            value: 'contains',
            funcArgs: funcArgs,
        };
    },
    endswith: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'endswithFuncExp',
            value: 'endswith',
            funcArgs: funcArgs,
        };
    },
    indexof: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'indexofFuncExp',
            value: 'indexof',
            funcArgs: funcArgs,
        };
    },
    length: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'lengthFuncExp',
            value: 'length',
            funcArgs: funcArgs,
        };
    },
    startswith: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'startswithFuncExp',
            value: 'startswith',
            funcArgs: funcArgs,
        };
    },
    substring: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'substringFuncExp',
            value: 'substring',
            funcArgs: funcArgs,
        };
    },
    hassubset: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'hassubsetFuncExp',
            value: 'hassubset',
            funcArgs: funcArgs,
        };
    },
    hassubsequence: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'hassubsequenceFuncExp',
            value: 'hassubsequence',
            funcArgs: funcArgs,
        };
    },
    matchesPattern: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'matchesPatternFuncExp',
            value: 'matchesPattern',
            funcArgs: funcArgs,
        };
    },
    tolower: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'tolowerFuncExp',
            value: 'tolower',
            funcArgs: funcArgs,
        };
    },
    toupper: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'toupperFuncExp',
            value: 'toupper',
            funcArgs: funcArgs,
        };
    },
    trim: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'trim FuncExp',
            value: 'trim',
            funcArgs: funcArgs,
        };
    },
    day: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'dayFuncExp',
            value: 'day',
            funcArgs: funcArgs,
        };
    },
    date: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'dateFuncExp',
            value: 'date',
            funcArgs: funcArgs,
        };
    },
    fractionalseconds: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'fractionalsecondsExp',
            value: 'fractionalseconds',
            funcArgs: funcArgs,
        };
    },
    hour: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'hourFuncExp',
            value: 'hour',
            funcArgs: funcArgs,
        };
    },
    maxdatetime: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'maxdatetimeFuncExp',
            value: 'maxdatetime',
            funcArgs: funcArgs,
        };
    },
    mindatetime: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'mindatetimeFuncExp',
            value: 'mindatetime',
            funcArgs: funcArgs,
        };
    },
    minute: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'minuteFuncExp',
            value: 'minute',
            funcArgs: funcArgs,
        };
    },
    month: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'monthFuncExp',
            value: 'month',
            funcArgs: funcArgs,
        };
    },
    now: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'nowFuncExp',
            value: 'now',
            funcArgs: funcArgs,
        };
    },
    second: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'secondFuncExp',
            value: 'second',
            funcArgs: funcArgs,
        };
    },
    time: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'timeFuncExp',
            value: 'time',
            funcArgs: funcArgs,
        };
    },
    totaloffsetminutes: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'totaloffsetminutesFuncExp',
            value: 'totaloffsetminutes',
            funcArgs: funcArgs,
        };
    },
    totalseconds: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'totalsecondsFuncExp',
            value: 'totalseconds',
            funcArgs: funcArgs,
        };
    },
    year: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'yearFuncExp',
            value: 'year',
            funcArgs: funcArgs,
        };
    },
    ceiling: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'ceilingFuncExp',
            value: 'ceiling',
            funcArgs: funcArgs,
        };
    },
    floor: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'floorFuncExp',
            value: 'floor',
            funcArgs: funcArgs,
        };
    },
    round: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'roundFuncExp',
            value: 'round',
            funcArgs: funcArgs,
        };
    },
    cast: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'castFuncExp',
            value: 'cast',
            funcArgs: funcArgs,
        };
    },
    isof: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'isofFuncExp',
            value: 'isof',
            funcArgs: funcArgs,
        };
    },
    case: function (funcArgs) {
        return {
            tokenType: 'queryFuncExp',
            subType: 'caseFuncExp',
            value: 'case',
            funcArgs: funcArgs,
        };
    },
};

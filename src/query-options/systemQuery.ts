import { constants, removeStartEndQuotes } from '../utils';

export const operators: { [index: string]: string } = {
    // Comparison Operators
    eq: '=',
    ne: '<>',
    gt: '>',
    ge: '>=',
    lt: '<',
    le: '<=',
    in: 'in',

    // Logical Operators

    and: 'and',
    or: 'or',
    not: 'NOT',

    // Arithmetic Operators

    add: '+',
    sub: '-',
    mul: '*',
    div: '/',
    mod: '%'
};

export const queryFuncs: { [index: string]: (funcArgs: string) => string } = {
    concat: function (funcArgs: string) {
        // concat function works as it is in sql also
        return `concat(${funcArgs})`;
    },
    contains: function (funcArgs: string) {
        // In case of contains, make it a 'LIKE'
        let [col, value, ...restArgs] = funcArgs.split(',');
        col = col.trim();
        value = value.trim();
        if (!col || !value || col.length === 0 || value.length === 0 || restArgs.length > 0) {
            // guard clause
            throw new Error(
                `contains function needs only two arguements one column name and one search string, received: ${funcArgs}`
            );
        }
        if (
            value[0] === constants.SINGLE_QUOTE &&
            value[value.length - 1] !== constants.SINGLE_QUOTE
        ) {
            throw new Error(
                `${value} is not in valid string format, missing single quote at the end`
            );
        } else if (
            value[0] !== constants.SINGLE_QUOTE &&
            value[value.length - 1] === constants.SINGLE_QUOTE
        ) {
            throw new Error(
                `${value} is not in valid string format, missing single quote at the start`
            );
        } else if (
            value[0] === constants.SINGLE_QUOTE &&
            value[value.length - 1] === constants.SINGLE_QUOTE
        ) {
            return `${col} LIKE '%${removeStartEndQuotes(value)}%'`;
        }
        return `${col} LIKE %${value}%`;
    },
    endswith: function (funcArgs: string) {
        // In case of endswith, make it a 'LIKE' with only starting %
        let [col, value, ...restArgs] = funcArgs.split(',');
        col = col.trim();
        value = value.trim();
        if (!col || !value || col.length === 0 || value.length === 0 || restArgs.length > 0) {
            // guard clause
            throw new Error(
                `endswith function needs only two arguements one column name and one search string, received: ${funcArgs}`
            );
        }
        if (
            value[0] === constants.SINGLE_QUOTE &&
            value[value.length - 1] !== constants.SINGLE_QUOTE
        ) {
            throw new Error(
                `${value} is not in valid string format, missing single quote at the end`
            );
        } else if (
            value[0] !== constants.SINGLE_QUOTE &&
            value[value.length - 1] === constants.SINGLE_QUOTE
        ) {
            throw new Error(
                `${value} is not in valid string format, missing single quote at the start`
            );
        } else if (
            value[0] === constants.SINGLE_QUOTE &&
            value[value.length - 1] === constants.SINGLE_QUOTE
        ) {
            return `${col} LIKE '%${removeStartEndQuotes(value)}'`;
        }
        return `${col} LIKE %${value}`;
    },
    startswith: function (funcArgs: string) {
        // In case of endswith, make it a 'LIKE' with only starting %
        let [col, value, ...restArgs] = funcArgs.split(',');
        col = col.trim();
        value = value.trim();
        if (!col || !value || col.length === 0 || value.length === 0 || restArgs.length > 0) {
            // guard clause
            throw new Error(
                `startswith function needs only two arguements one column name and one search string, received: ${funcArgs}`
            );
        }
        if (
            value[0] === constants.SINGLE_QUOTE &&
            value[value.length - 1] !== constants.SINGLE_QUOTE
        ) {
            throw new Error(
                `${value} is not in valid string format, missing single quote at the end`
            );
        } else if (
            value[0] !== constants.SINGLE_QUOTE &&
            value[value.length - 1] === constants.SINGLE_QUOTE
        ) {
            throw new Error(
                `${value} is not in valid string format, missing single quote at the start`
            );
        } else if (
            value[0] === constants.SINGLE_QUOTE &&
            value[value.length - 1] === constants.SINGLE_QUOTE
        ) {
            return `${col} LIKE '${removeStartEndQuotes(value)}%'`;
        }
        return `${col} LIKE ${value}%`;
    },
    // indexOF: TODO
    length: function (funcArgs: string) {
        // concat function works as it is in postgres / oracle /  also
        return `length(${funcArgs})`;
    },
    substring: function (funcArgs: string) {
        // concat function works as it is in postgres / oracle /
        return `length(${funcArgs})`;
    },
};

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
        console.log('From func ' + funcArgs);

        return 'Inside function concat';
    }
};

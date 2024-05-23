import { parseFilter, parseOrderby, parseSkip, parseTop } from '..';
import { allQueries } from './allQueries';
import { allQueriesTestResults } from './allQueriesTestResults';
const skipToken = { token: { tokenType: 'skipExp', value: 1000 } };
const topToken = { token: { tokenType: 'topExp', value: 10 } };
const orderByToken = {
    token: [
        {
            tokenType: 'orderByExp',
            colValue: 'ReleaseDate',
            colOrder: 'asc',
        },
        { tokenType: 'orderByExp', colValue: 'Rating', colOrder: 'desc' },
    ],
};

const top = '10';
const skip = '1000';
const orderBy = 'ReleaseDate asc, Rating desc'
describe('Check all the parser functions', () => {
    test('Top - returns top Token', () => {
        expect(parseTop(top)).toEqual(topToken);
    });

    test('Skip - returns skip Token', () => {
        expect(parseSkip(skip)).toEqual(skipToken);
    });

    test('OrderBy - returns orderby Token', () => {
        expect(parseOrderby(orderBy)).toEqual(orderByToken);
    });

    test('Filter - returns filter Token', () => {
        expect(parseFilter(allQueries)).toEqual(allQueriesTestResults);
    });

});

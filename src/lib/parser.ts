import { constants } from './utils/constants';
import { operatorLexer, conditionLexer, groupingLexer, queryFuncLexer } from './lexer';
import { checkDigitOnly, checkSpecialChar } from './utils/helper';
import { IOdataFilterToken, IOdataOrderByToken, IOdataSkipToken, IOdataTopToken, IParsedFilterRes, IParsedOrderByRes, IParsedSkipRes, IParsedTopRes } from '..';

class OdataQueryParser {
    private filterTokens: IOdataFilterToken[];
    private filterToken: IOdataFilterToken;
    private orderByToken: IOdataOrderByToken;
    private orderByTokens: IOdataOrderByToken[];
    private skipToken: IOdataSkipToken;
    private topToken: IOdataTopToken;
    private prevLexerSubType: string;

    constructor() {
        this.prevLexerSubType = constants.INITIALIZE_STR;
        this.filterTokens = [];
        this.orderByTokens = [];
        this.filterToken = {
            tokenType: '',
            subType: '',
            value: '',
        };
        this.orderByToken = {
            tokenType: '',
            colValue: '',
            colOrder: '',
        };
        this.skipToken = {
            tokenType: '',
            value: 0,
        };
        this.topToken = {
            tokenType: '',
            value: 0,
        };
    }

    private parseFilter(sourceStr: string) {
        sourceStr = sourceStr.trim();
        // Needed for operators
        let numOfWhiteSpace = constants.INITIALIZE_NUM_ZERO;
        let operator = constants.INITIALIZE_STR;
        let totalSingleQuotes = constants.INITIALIZE_NUM_ZERO;
        // Needed for functions
        let tillSpaceStr = constants.INITIALIZE_STR;
        let inFunctionMode = false; //is opening bracket for function found ?
        let funcName = constants.INITIALIZE_STR;
        let funcArgs = constants.INITIALIZE_STR;
        let prevFilterEle = constants.INITIALIZE_STR;
        let totalOpenBrac = 0;
        let totalCloseBrac = 0;
        for (let index = 0; index < sourceStr.length; index++) {
            const filterEle = sourceStr[index];
            tillSpaceStr += filterEle;
            // Check white spaces first and then functions
            if (filterEle === constants.SINGLE_QUOTE && !inFunctionMode) {
                totalSingleQuotes += 1;
            } else if ((filterEle === constants.WHITE_SPACE || filterEle === constants.WHITE_SPACE_ASCII) && !inFunctionMode && totalSingleQuotes % 2 === 0) {
                // if total single quotes is odd that means some string has started which is not ended,
                //  it can contain white spaces which we should not consider.
                numOfWhiteSpace += 1;

                if (numOfWhiteSpace % 2 === 0 && prevFilterEle !== constants.INITIALIZE_STR_ONESPACE) {
                    //both opening and closing white space are covered
                    if (operatorLexer[operator]) {
                        const token: IOdataFilterToken = operatorLexer[operator]();
                        this.appendToFilterToken(token);
                        // reset everything
                        operator = constants.INITIALIZE_STR;
                        numOfWhiteSpace = constants.INITIALIZE_NUM_ZERO;
                    } else {
                        throw new Error(`Invalid operator ${operator} found at pos: ${index - operator.length}`);
                    }
                } else if (prevFilterEle !== constants.INITIALIZE_STR_ONESPACE) {
                    if (tillSpaceStr.trim().length <= 0) {
                        prevFilterEle = filterEle;
                        continue;
                    }
                    const trimTillSpaceStr = tillSpaceStr.trim();
                    if (operatorLexer[trimTillSpaceStr] && operatorLexer[trimTillSpaceStr]().subType === 'notExp') {
                        // This is a valid condition for NOT expression to be in the string;
                        const token: IOdataFilterToken = operatorLexer[trimTillSpaceStr]();
                        this.appendToFilterToken(token);
                        // reset everything
                        operator = constants.INITIALIZE_STR;
                        numOfWhiteSpace = constants.INITIALIZE_NUM_ZERO;
                    } else {
                        this.filterToken.tokenType = conditionLexer.conditionMemberExp;
                        this.filterToken.value = tillSpaceStr.trim();
                        this.appendToFilterToken(this.filterToken);
                    }
                } else {
                    throw new Error(`Not a valid whitespace at pos: ${index + 1}`);
                }
                tillSpaceStr = constants.INITIALIZE_STR;
            } else if (
                filterEle === constants.OPENING_BRACKET &&
                !inFunctionMode &&
                prevFilterEle !== constants.OPENING_BRACKET &&
                prevFilterEle !== constants.CLOSING_BRACKET &&
                prevFilterEle !== constants.INITIALIZE_STR_ONESPACE &&
                tillSpaceStr.length > 1
            ) {
                //last 2 conditions are to handle 'in ()' and grouping scenarios
                inFunctionMode = !inFunctionMode;
                funcName = tillSpaceStr.slice(0, -1); // remove the last char which should be '('
                totalOpenBrac++;
                tillSpaceStr = constants.INITIALIZE_STR;
                numOfWhiteSpace = constants.INITIALIZE_NUM_ZERO;
                operator = constants.INITIALIZE_STR;
            } else if (numOfWhiteSpace > 0 && !inFunctionMode) {
                if (checkSpecialChar(prevFilterEle)) {
                    throw new Error(`Illigel char: ${prevFilterEle} before operator found at pos: ${index - 1}`);
                }
                operator += filterEle;
            } else if (inFunctionMode && filterEle === constants.CLOSING_BRACKET) {
                totalCloseBrac++;
                if (totalCloseBrac === totalOpenBrac) {
                    funcArgs = constants.OPENING_BRACKET + tillSpaceStr;
                    if (queryFuncLexer[funcName]) {
                        const token: IOdataFilterToken = queryFuncLexer[funcName](funcArgs);
                        this.appendToFilterToken(token);
                        inFunctionMode = !inFunctionMode;
                        tillSpaceStr = constants.INITIALIZE_STR;
                    } else {
                        throw new Error(`No implementation found for function ${funcName}`);
                    }
                }
            } else if (filterEle === constants.OPENING_BRACKET && this.prevLexerSubType === 'inExp') {
                // Last operator was in, so fetch the values
                index = this.getInExpValue(sourceStr, index);
                tillSpaceStr = constants.INITIALIZE_STR;
            } else if ((filterEle === constants.OPENING_BRACKET || filterEle === constants.CLOSING_BRACKET) && this.prevLexerSubType !== 'inExp' && !inFunctionMode) {
                // Valid candidate for grouping operator
                if (filterEle === constants.CLOSING_BRACKET && tillSpaceStr.trim().length > 1) {
                    this.filterToken.tokenType = conditionLexer.conditionMemberExp;
                    this.filterToken.value = tillSpaceStr.trim().slice(0, -1);
                    this.appendToFilterToken(this.filterToken);
                }
                const token: IOdataFilterToken = groupingLexer(filterEle);
                this.appendToFilterToken(token);
                tillSpaceStr = constants.INITIALIZE_STR;
            } else if (filterEle === constants.OPENING_BRACKET && inFunctionMode) {
                //Handle function inside function
                totalOpenBrac++;
            }
            prevFilterEle = filterEle;
        }
        if (numOfWhiteSpace > 0 || totalSingleQuotes % 2 !== 0) {
            throw new Error(`Not a legal Odata $filter string`);
        }
        if (inFunctionMode || totalOpenBrac !== totalOpenBrac) {
            throw new Error('Not a legal Odata $filter string, please validate the functions and their brackets');
        }
        if (tillSpaceStr.length > 0) {
            this.filterToken.tokenType = conditionLexer.conditionMemberExp;
            this.filterToken.value = tillSpaceStr.trim();
            this.appendToFilterToken(this.filterToken);
        }
    }

    private parseOrderBy(sourceStr: string) {
        const clauses = sourceStr.split(','); //ReleaseDate asc, Rating desc
        for (let index = 0; index < clauses.length; index++) {
            const clause = clauses[index];
            let [col, order, ...restData] = clause.trim().split(' '); // ReleaseDate asc
            col = col.trim();
            order = order.trim();
            if (!col || !order || col.length === 0 || order.length === 0 || restData.length > 0) {
                // guard clause
                throw new Error(`order by needed one column name seperated by space followed with ordering, received: ${clause}`);
            } else if (!constants.ORDERBY_VALUES.includes(order)) {
                throw new Error(`order by can be one of ${constants.ORDERBY_VALUES.join(',')}, received: ${order}`);
            }
            this.orderByToken.tokenType = 'orderByExp';
            this.orderByToken.colValue = col;
            this.orderByToken.colOrder = order;
            this.appendToOrderByToken(this.orderByToken);
        }
    }

    private parseTop(source: string) {
        if (!checkDigitOnly(source)) {
            throw new Error('Top should contain only integers');
        }
        const limit = parseInt(source);
        this.topToken = {
            tokenType: 'topExp',
            value: limit,
        };
    }

    private parseSkip(source: string) {
        if (!checkDigitOnly(source)) {
            throw new Error('Skip should contain only integers');
        }
        const offset = parseInt(source);
        this.skipToken = {
            tokenType: 'skipExp',
            value: offset,
        };
    }

    private getInExpValue(sourceStr: string, currInd: number): number {
        let tillNowStr = constants.INITIALIZE_STR;
        let skipInd = currInd;
        for (let index = currInd; index < sourceStr.length; index++) {
            const ele = sourceStr[index];
            if (ele === constants.CLOSING_BRACKET) {
                tillNowStr += ele;
                this.filterToken.tokenType = conditionLexer.conditionMemberExp;
                this.filterToken.value = tillNowStr.trim();
                this.appendToFilterToken(this.filterToken);
                skipInd = index;
                break;
            }
            tillNowStr += ele;
        }
        return skipInd;
    }

    private appendToFilterToken(filterToken: IOdataFilterToken) {
        this.prevLexerSubType = filterToken.subType;
        this.filterTokens.push(filterToken);
        this.resetFilterToken();
    }

    private appendToOrderByToken(orderByToken: IOdataOrderByToken) {
        this.orderByTokens.push(orderByToken);
        this.resetOrderByToken();
    }

    private resetFilterToken() {
        this.filterToken = {
            tokenType: '',
            subType: '',
            value: '',
        };
    }

    private resetOrderByToken() {
        this.orderByToken = {
            tokenType: '',
            colValue: '',
            colOrder: '',
        };
    }

    private resetEverything() {
        this.prevLexerSubType = constants.INITIALIZE_STR;
        this.filterTokens = [];
        this.orderByTokens = [];
        this.filterToken = {
            tokenType: '',
            subType: '',
            value: '',
        };
        this.orderByToken = {
            tokenType: '',
            colValue: '',
            colOrder: '',
        };
        this.skipToken = {
            tokenType: '',
            value: 0,
        };
        this.topToken = {
            tokenType: '',
            value: 0,
        };
    }

    public getParsedFilter(sourceStr: string): IParsedFilterRes {
        try {
            this.resetEverything();
            this.parseFilter(sourceStr);
            return {
                token: this.filterTokens,
            };
        } catch (err) {
            return {
                error: err as Error,
                token: this.filterTokens,
            };
        }
    }

    public getParsedOrderBy(sourceStr: string): IParsedOrderByRes {
        try {
            this.resetEverything();
            this.parseOrderBy(sourceStr);
            return {
                token: this.orderByTokens,
            };
        } catch (err) {
            return {
                error: err as Error,
                token: this.orderByTokens,
            };
        }
    }

    public getParsedSkipToken(source: string): IParsedSkipRes {
        try {
            this.resetEverything();
            this.parseSkip(source);
            return {
                token: this.skipToken,
            };
        } catch (err) {
            return {
                error: err as Error,
                token: this.skipToken,
            };
        }
    }

    public getParsedTopToken(source: string): IParsedTopRes {
        try {
            this.resetEverything();
            this.parseTop(source);
            return {
                token: this.topToken,
            };
        } catch (err) {
            return {
                error: err as Error,
                token: this.topToken,
            };
        }
    }
}

export const odataQueryParser = new OdataQueryParser();

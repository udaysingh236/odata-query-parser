import { operators, queryFuncs } from './query-options/systemQuery';
import { constants } from './utils';

export class OdataQueryParser {
    private parsedFilterStr: string;
    private dbType: string;
    constructor(dbType: string) {
        this.dbType = dbType;
        this.parsedFilterStr = constants.INITIALIZE_STR;
    }

    private parseFilter(sourceStr: string) {
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
        for (let index = 0; index < sourceStr.length; index++) {
            const filterEle = sourceStr[index];
            tillSpaceStr += filterEle;

            // Check white spaces first and then functions
            if (filterEle === constants.SINGLE_QUOTE && !inFunctionMode) {
                totalSingleQuotes += 1;
                this.parsedFilterStr += filterEle;
            } else if (
                (filterEle === constants.WHITE_SPACE ||
                    filterEle === constants.WHITE_SPACE_ASCII) &&
                !inFunctionMode &&
                totalSingleQuotes % 2 === 0
            ) {
                // if total single quotes is odd that means some string has started which is not ended,
                //  it can contain white spaces which we should not consider.
                numOfWhiteSpace += 1;
                tillSpaceStr = constants.INITIALIZE_STR;
                if (numOfWhiteSpace % 2 === 0) {
                    //both opening and closing white space are covered
                    if (operators[operator]) {
                        this.parsedFilterStr += operators[operator];
                        // reset everything
                        operator = constants.INITIALIZE_STR;
                        numOfWhiteSpace = constants.INITIALIZE_NUM_ZERO;
                    } else {
                        throw new Error(
                            `Invalid operator ${operator} found at pos: ${index - operator.length}`
                        );
                    }
                }
                this.parsedFilterStr += filterEle;
            } else if (
                filterEle === constants.OPENING_BRACKET &&
                !inFunctionMode &&
                prevFilterEle !== constants.OPENING_BRACKET &&
                prevFilterEle !== constants.CLOSING_BRACKET &&
                prevFilterEle !== constants.INITIALIZE_STR_ONESPACE &&
                tillSpaceStr.length > 0
            ) {
                //last 2 conditions are to handle 'in ()' and grouping scenarios
                inFunctionMode = !inFunctionMode;
                funcName = tillSpaceStr.slice(0, -1); // remove the last char which should be '('
                tillSpaceStr = constants.INITIALIZE_STR;
                numOfWhiteSpace = constants.INITIALIZE_NUM_ZERO;
                operator = constants.INITIALIZE_STR;
            } else if (numOfWhiteSpace > 0 && !inFunctionMode) {
                if (prevFilterEle === constants.SINGLE_QUOTE) {
                    //will put a regex for special characters
                    throw new Error(
                        `Illigel char: ${prevFilterEle} before operator found at pos: ${index - 1}`
                    );
                }
                operator += filterEle;
            } else if (inFunctionMode && filterEle === constants.CLOSING_BRACKET) {
                funcArgs = tillSpaceStr.slice(0, -1); // remove the last char which should be ')'
                if (queryFuncs[funcName]) {
                    const funcStr = queryFuncs[funcName](funcArgs);
                    this.parsedFilterStr = this.parsedFilterStr.slice(0, funcName.length * -1); // remove the already inserted function name from pasrsed string
                    this.parsedFilterStr += funcStr;
                    inFunctionMode = !inFunctionMode;
                } else {
                    throw new Error(`No implementation found for function ${funcName}`);
                }
            } else if (!inFunctionMode) {
                this.parsedFilterStr += filterEle;
            }
            prevFilterEle = filterEle;
        }
        if (numOfWhiteSpace > 0 || totalSingleQuotes % 2 !== 0) {
            throw new Error(`Not a legal Odata $filter string`);
        }
    }

    public getFilter(sourceStr: string) {
        this.parseFilter(sourceStr);
        return this.parsedFilterStr;
    }
}

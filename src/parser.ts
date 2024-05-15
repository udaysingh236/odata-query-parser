import { operators, queryFuncs } from './query-options/systemQuery';
import { CLOSING_BRACKET, OPENING_BRACKET, WHITE_SPACE, WHITE_SPACE_ASCII } from './utils';

export class OdataQueryParser {
    private filterStr: string;
    private parsedFilterStr: string;
    constructor(filterStr: string) {
        this.filterStr = filterStr;
        this.parsedFilterStr = '';
    }

    private parseFilter() {
        // Needed for operators
        let numOfWhiteSpace = 0;
        let operator = '';
        let totalSingleQuotes = 0;
        // Needed for functions
        let tillSpaceStr = '';
        let inFunctionMode = false; //is opening bracket for function found ?
        let funcName = '';
        let funcArgs = '';
        let prevFilterEle = '';
        for (let index = 0; index < this.filterStr.length; index++) {
            const filterEle = this.filterStr[index];
            tillSpaceStr += prevFilterEle;

            // Check white spaces first and then functions
            if (filterEle === "'" && !inFunctionMode) {
                totalSingleQuotes += 1;
                this.parsedFilterStr += filterEle;
            } else if (
                (filterEle === WHITE_SPACE || filterEle === WHITE_SPACE_ASCII) &&
                !inFunctionMode &&
                totalSingleQuotes % 2 === 0
            ) {
                // if total single quotes is odd that means some string has started which is not ended,
                //  it can contain white spaces which we should not consider.
                numOfWhiteSpace += 1;
                tillSpaceStr = '';
                if (numOfWhiteSpace % 2 === 0) {
                    //both opening and closing white space are covered
                    if (operators[operator]) {
                        this.parsedFilterStr += operators[operator];
                        // reset everything
                        operator = '';
                        numOfWhiteSpace = 0;
                    } else {
                        throw new Error(
                            `Invalid operator ${operator} found at pos: ${index - operator.length}`
                        );
                    }
                }
                this.parsedFilterStr += filterEle;
            } else if (
                filterEle === OPENING_BRACKET &&
                !inFunctionMode &&
                prevFilterEle !== OPENING_BRACKET &&
                prevFilterEle !== CLOSING_BRACKET &&
                prevFilterEle !== ' ' &&
                tillSpaceStr.length > 0
            ) {
                //last 2 conditions are to handle 'in ()' and grouping scenarios
                inFunctionMode = !inFunctionMode;
                funcName = tillSpaceStr.trim();
                tillSpaceStr = '';
                numOfWhiteSpace = 0;
                operator = '';
            } else if (numOfWhiteSpace > 0 && !inFunctionMode) {
                if (prevFilterEle === "'") { //will put a regex for special characters
                    throw new Error(
                        `Illigel char: ${prevFilterEle} before operator found at pos: ${index - 1}`
                    );
                }
                operator += filterEle;
            } else if (inFunctionMode && filterEle === CLOSING_BRACKET) {
                funcArgs = tillSpaceStr + CLOSING_BRACKET;
                if (queryFuncs[funcName]) {
                    const str = queryFuncs[funcName](funcArgs);
                    console.log(str);
                    inFunctionMode = !inFunctionMode;
                }
            } else if (!inFunctionMode) {
                this.parsedFilterStr += filterEle;
            }
            prevFilterEle = filterEle;
        }
        if (numOfWhiteSpace > 0) {
            throw new Error(`Not a legal Odata filter string`);
        }
    }

    public getParsedFilterStr() {
        this.parseFilter();
        return this.parsedFilterStr;
    }
}

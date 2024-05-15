import { operators } from "./query-options/systemQuery";
import { WHITE_SPACE, WHITE_SPACE_ASCII } from "./utils";

export class OdataQueryParser {
    private filterStr:string;
    private parsedFilterStr: string;
    constructor(filterStr:string) {
        this.filterStr = filterStr;
        this.parsedFilterStr = '';
    }

    private parseFilter() {
        let numOfWhiteSpace = 0;
        let isFunctions = false;
        let operator = '';
        for (let index = 0; index < this.filterStr.length; index++) {
            const filterEle = this.filterStr[index];
            if (filterEle === WHITE_SPACE || filterEle === WHITE_SPACE_ASCII) {
                numOfWhiteSpace += 1;
                if (numOfWhiteSpace % 2 === 0) { //both opening and closing white space are covered
                    if (operators[operator]) {
                        this.parsedFilterStr += operators[operator];
                        // reset everything
                        operator = '';
                        numOfWhiteSpace = 0;
                    } else {
                        throw new Error(`Invalid operator ${operator} found at pos: ${index - operator.length}`);
                    }
                }
                this.parsedFilterStr += filterEle;
            } else {
                if (numOfWhiteSpace > 0) { 
                    operator += filterEle;
                } else {
                    this.parsedFilterStr += filterEle;
                }
            }
            
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
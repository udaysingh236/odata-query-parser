import { OdataQueryParser } from "./parser";

function filterParser() {
    try {
        const filter = "Title le 'Article1' and Title le 'Article1'";
        const parser = new OdataQueryParser(filter);
        console.log(parser.getParsedFilterStr());
    } catch (error) {
        console.log(`Error: ${error}`);
        
    }
}

filterParser();
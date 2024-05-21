import { OdataQueryParser } from './parser';

export const odataQueryParser = (): OdataQueryParser => {
    const odataQueryDb = new OdataQueryParser();
    return odataQueryDb;
};

function filterParser() {
    try {
        const odataQueryDb = new OdataQueryParser();
        // const filter = "endswith(CompanyName,'Futterkiste') and (Title le 'Article1' and Title le 30 and concat('Uday', 'singh') eq 'Uday Singh') or contains(CompanyName,'Alfreds') or contains(CompanyName,3";
        // const filter = "Title le 'Article1' and (Title le 'Article1' and Price in (10 , 20, 'Uday') and Title le 30) and concat(concat(City,', '), Country) eq 'Berlin, Germany'";
        // const orderBy = 'ReleaseDate asc, Rating desc'
        const top = '10'
        const skip = '1000'
        // console.log(odataQueryDb.getParsedFilter(filter).error?.message);
        // console.log(odataQueryDb.getParsedFilter(filter));
        console.log(odataQueryDb.getParsedSkipToken(skip));
        console.log(odataQueryDb.getParsedTopToken(top));
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

filterParser();

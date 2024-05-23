import { IOdataFilterToken, IParsedFilterRes, IParsedOrderByRes, IParsedSkipRes, IParsedTopRes, odataQueryParser } from './lib/parser';

export const parseFilter = (source: string): IParsedFilterRes => odataQueryParser.getParsedFilter(source);
export const parseOrderby = (source: string): IParsedOrderByRes => odataQueryParser.getParsedOrderBy(source);
export const parseSkip = (source: string): IParsedSkipRes => odataQueryParser.getParsedSkipToken(source);
export const parseTop = (source: string): IParsedTopRes => odataQueryParser.getParsedTopToken(source);

function filterParser() {
    try {
        const filter = "Address/City eq 'Redmond' and Address/City ne 'London' or Price gt 20 or Price ge 10 not Price lt 20 and Price le 100 or Address/City in ('Redmond', 'London') not Price add 5 gt 10 or Price sub 5 gt 10 or Price mul 2 gt 2000 not Price div 2 gt 4 or Price mod 2 eq 0 and (Price sub 5) gt 10 and concat(concat(City,', '), Country) eq 'Berlin, Germany' and contains(CompanyName,'freds') and endswith(CompanyName,'Futterkiste') or indexof(CompanyName,'lfreds') eq 1 and length(CompanyName) eq 19 or startswith(CompanyName,’Alfr’) and substring(CompanyName,1) eq 'lfreds Futterkiste' or hassubset([4,1,3],[3,1]) and hassubsequence([4,1,3,1],[1,1]) or matchesPattern(CompanyName,'%5EA.*e$') and tolower(CompanyName) eq 'alfreds futterkiste' or toupper(CompanyName) eq 'ALFREDS FUTTERKISTE' and trim(CompanyName) eq 'Alfreds Futterkiste' or day(StartTime) eq 8 and date(StartTime) ne date(EndTime) and second(StartTime) eq 0 or hour(StartTime) eq 1 and EndTime eq maxdatetime() and StartTime eq mindatetime() and minute(StartTime) eq 0 and month(BirthDate) eq 12 or StartTime ge now() and second(StartTime) eq 0 or time(StartTime) le StartOfDay and totaloffsetminutes(StartTime) eq 60 or totalseconds(duration'PT1M') eq 60 and year(BirthDate) eq 0 and ceiling(Freight) eq 33 or floor(Freight) eq 32 and round(Freight) eq 32 or cast(ShipCountry,Edm.String) not isof(NorthwindModel.Order) and case(X gt 0:1,X lt 0:-1,true:0)";
        // const filter = "Title le 'Article1' and (Title le 'Article1' and Price in (10 , 20, 'Uday') and Title le 30) and concat(concat(City,', '), Country) eq 'Berlin, Germany'";
        const orderBy = 'ReleaseDate asc, Rating desc'
        const top = '10';
        const skip = '1000';
        // console.log(odataQueryDb.getParsedFilter(filter).error?.message);
        // console.log(odataQueryDb.getParsedFilter(filter));
        // console.log(parseSkip(skip));
        // console.log(parseTop(top));
        console.log(JSON.stringify(parseFilter(filter)));
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

// filterParser();

import { OdataQueryParser } from './parser';

const dbTypes: string[] = ['pg', 'mysql', 'oracle'];

export const odataQueryParser = (dbType: string): OdataQueryParser => {
    if (!dbTypes.includes(dbType)) {
        throw new Error(`${dbType} is currently not supported`);
    }
    const odataQueryDb = new OdataQueryParser(dbType);
    return odataQueryDb;
};
// function filterParser() {
//     try {
//         const filter = "endswith(CompanyName,'Futterkiste') and (Title le 'Article1' and Title le 30 and concat('Uday', 'singh') eq 'Uday Singh') or contains(CompanyName,'Alfreds') or contains(CompanyName,3 )";
//         console.log(odataQueryParser.getParsedFilterStr(filter));
//     } catch (error) {
//         console.log(`Error: ${error}`);

//     }
// }

// filterParser();

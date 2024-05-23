import { odataQueryParser } from './lib/parser';

export interface IOdataFilterToken {
    tokenType: string;
    subType: string;
    value: string;
    funcArgs?: string;
}

export interface IOdataOrderByToken {
    tokenType: string;
    colValue: string;
    colOrder: string;
}

export interface IOdataTopToken {
    tokenType: string;
    value: number;
}

export interface IOdataSkipToken {
    tokenType: string;
    value: number;
}

export interface IParsedFilterRes {
    error?: Error;
    token: IOdataFilterToken[];
}

export interface IParsedOrderByRes {
    error?: Error;
    token: IOdataOrderByToken[];
}

export interface IParsedSkipRes {
    error?: Error;
    token: IOdataSkipToken;
}

export interface IParsedTopRes {
    error?: Error;
    token: IOdataTopToken;
}

export const parseFilter = (source: string): IParsedFilterRes => odataQueryParser.getParsedFilter(source);
export const parseOrderby = (source: string): IParsedOrderByRes => odataQueryParser.getParsedOrderBy(source);
export const parseSkip = (source: string): IParsedSkipRes => odataQueryParser.getParsedSkipToken(source);
export const parseTop = (source: string): IParsedTopRes => odataQueryParser.getParsedTopToken(source);

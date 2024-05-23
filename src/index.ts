import { IParsedFilterRes, IParsedOrderByRes, IParsedSkipRes, IParsedTopRes, odataQueryParser } from './lib/parser';

export const parseFilter = (source: string): IParsedFilterRes => odataQueryParser.getParsedFilter(source);
export const parseOrderby = (source: string): IParsedOrderByRes => odataQueryParser.getParsedOrderBy(source);
export const parseSkip = (source: string): IParsedSkipRes => odataQueryParser.getParsedSkipToken(source);
export const parseTop = (source: string): IParsedTopRes => odataQueryParser.getParsedTopToken(source);

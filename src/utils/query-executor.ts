import { soundex } from 'soundex-code';
import { Query } from '../services/cat-map/cat-map-types';

class QueryExecutor {
    public query: Query;

    public constructor(inpQuery: Query) {
        this.query = inpQuery;
    }

    public run(fieldVal: any): boolean {
        let res = false;
        const { opr, value: queryVal } = this.query;
        if (fieldVal && queryVal) {
            switch (opr) {
            case '==': {
                res = fieldVal.toString() === queryVal.toString() ||
                        checkSoundexInText(queryVal.toString(), fieldVal.toString());
                break;
            }
            case '!=': {
                res = fieldVal.toString() !== queryVal.toString();
                break;
            }
            case '>': {
                res = fieldVal > queryVal;
                break;
            }
            case '>=': {
                res = fieldVal >= queryVal;
                break;
            }
            case '<': {
                res = fieldVal < queryVal;
                break;
            }
            case '<=': {
                res = fieldVal <= queryVal;
                break;
            }
            case 'having': {
                if (typeof fieldVal === 'string') {
                    if (Array.isArray(queryVal)) {
                        res = queryVal.some((item) => {
                            const qval = item.toString();
                            const text = fieldVal.toLowerCase();
                            const keyword = qval.toLowerCase();
                            return text.indexOf(keyword) > -1 || checkSoundexInText(keyword, text);
                        });
                    } else {
                        const qval = queryVal.toString();
                        const text = fieldVal.toLowerCase();
                        const keyword = qval.toLowerCase();
                        res = text.indexOf(keyword) > -1 || checkSoundexInText(keyword, text);
                    }
                }
                break;
            }
            case 'regex': {
                if (Array.isArray(queryVal)) {
                    res = queryVal.some((item) => {
                        const qval = item.toString();
                        const reg = new RegExp(qval, 'i');
                        return fieldVal.match(reg)?.length > 0;
                    });
                } else {
                    const qval = queryVal.toString();
                    const reg = new RegExp(qval, 'i');
                    res = fieldVal.match(reg)?.length > 0;
                }
                break;
            }
            case 'in': {
                if (Array.isArray(queryVal)) {
                    if (typeof queryVal[0] === 'string') {
                        res = queryVal.indexOf(fieldVal.toString() as never) > -1 ||
                                checkSoundexInArray(fieldVal.toString(), queryVal as string[]);
                    } else {
                        res = queryVal.indexOf(fieldVal as never) > -1;
                    }
                }
                break;
            }
            case 'range': {
                if (Array.isArray(queryVal)) {
                    res = typeof queryVal[0] === 'undefined' || fieldVal >= queryVal[0];
                    res = res && (typeof queryVal[1] === 'undefined' || fieldVal <= queryVal[1]);
                }
                break;
            }
            default: {
                // Nothing to do
            }
            }
        }
        return res;
    }
}

const checkSoundexInText = (keyword: string, text: string) => {
    const words = text.split(/\s+/);
    return words.some((word) => soundex(word.toString()) === soundex(keyword));
};

const checkSoundexInArray = (keyword: string, words: string[]) =>
    words.some((word) => soundex(word.toString()) === soundex(keyword));

export default QueryExecutor;

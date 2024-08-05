
import dictJSON from './output/10000-most-common-words-en-fr-dict.json';
import type { Dictionary, DictionaryWord } from './types';

const entries = Object.entries(dictJSON) as unknown as Array<[string, Array<DictionaryWord>]>;
export const dictionary: Dictionary = entries.reduce((acc, curr) => {
    acc.set(curr[0], curr[1]);
    return acc;
}, new Map() as Dictionary);

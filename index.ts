
import dictJSON from './output/10000-most-common-words-en-fr-dict.json';
import type { Dictionary } from './types';

export const dictionary: Dictionary = Object.entries(dictJSON).reduce((acc, curr) => {
    acc.set(curr[0], curr[1]);
    return acc;
}, new Map() as Dictionary);

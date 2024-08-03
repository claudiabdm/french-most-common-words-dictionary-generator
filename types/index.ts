export const legendLexiqueKaikki = {
    "NOM": 'noun',
    "ADJ": 'adj',
    "ADJ:dem": 'adj',
    "ADJ:ind": 'adj',
    "ADJ:int": 'adj',
    "ADJ:num": 'adj',
    'ADJ:pos': 'det',
    "VER": 'verb',
    "ADV": 'adv',
    "PRO:dem": 'pron',
    "PRO:ind": 'pron',
    "PRO:int": 'pron',
    "PRO:per": 'pron',
    "PRO:pos": 'pron',
    "PRO:rel": 'pron',
    "PRE": 'prep',
    "ART:def": 'article',
    "ART:inf": 'article',
    "ART:ind": 'article',
    "CON": 'conj',
    "ONO": 'intj',
    "AUX": 'verb'
} as const;


export type CategoryKey = keyof typeof legendLexiqueKaikki;
export type Category = typeof legendLexiqueKaikki[CategoryKey];

export type WordId = `${string}-${Category}`;

export interface BaseWord { word: string, category: Category, rank: number }
export type BaseDictionary = Map<WordId, BaseWord>

export interface KaikkiWord {
    pos: Category,
    word: string,
    antonyms?: Array<{
        word: string
    }>
    sounds?: Array<{
        audio: `LL-Q150 ${string}`,
        ogg_url: `${string}.ogg`
    }>,
    senses: [{
        examples: Array<{
            text: string,
            english: string
        }>,
        glosses: Array<string>
    }]
}
export type KaikkiEntries = Record<string, KaikkiWord[]>

export interface DictionaryWord extends BaseWord, Pick<KaikkiWord, 'senses'> {
    pronunciation: `${string}.ogg` | undefined
}

export type Dictionary = Map<string, Map<WordId, DictionaryWord>>
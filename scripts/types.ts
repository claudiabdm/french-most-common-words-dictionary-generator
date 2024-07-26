const legend = {
    "ADJ": "Adjective",
    "ADJ:dem": "Demonstrative adjective",
    "ADJ:ind": "Indefinite adjective",
    "ADJ:int": "Interrogative adjective",
    "ADJ:num": "Numeric adjective",
    "ADJ:pos": "Possessive adjective",
    "ADV": "Adverb",
    "ART:def": "Definite article",
    "ART:inf": "Indefinite article",
    "AUX": "Auxiliary",
    "CON": "Conjunction",
    "LIA": "Euphonic liaison (l')",
    "NOM": "Common noun",
    "ONO": "Onomatopoeia",
    "PRE": "Preposition",
    "PRO:dem": "Demonstrative pronoun",
    "PRO:ind": "Indefinite pronoun",
    "PRO:int": "Interrogative pronoun",
    "PRO:per": "Personal pronoun",
    "PRO:pos": "Possessive pronoun",
    "PRO:rel": "Relative pronoun",
    "VER": "Verb"
} as const


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
    sounds?: Array<{
        audio: `LL-Q150 ${string}`,
        ogg_url: `${string}.ogg`
    }>,
    senses: [{
        examples: Array<{
            text: string,
            english: string
        }>,
        glosses: Array<String>
    }]
}
export type KaikkiDictionary = Map<WordId, KaikkiWord>

export interface DictionaryWord extends BaseWord, Pick<KaikkiWord, 'senses'> {
    pronunciation: `${string}.ogg` | undefined
}

export type Dictionary = Map<WordId, DictionaryWord>
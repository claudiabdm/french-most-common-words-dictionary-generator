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
    head_templates: Array<{
        expansion: string
    }>
    antonyms?: Array<{
        word: string
    }>
    sounds?: Array<
        { ipa: string } &
        {
            audio: `LL-Q150 ${string}`,
            ogg_url: `${string}.ogg`
            mp3_url: `${string}.mp3`
        }
    >,
    senses: [{
        examples: Array<{
            text: string,
            english: string
            type: string | 'quotation'
        }>,
        glosses: Array<string>
    }]
}
export type KaikkiEntries = Record<string, KaikkiWord[]>

export interface DictionaryWord extends BaseWord, Pick<KaikkiWord, 'senses'> {
    ipa: string | undefined,
    pronunciation_ogg: `${string}.ogg` | undefined,
    pronunciation_mp3: `${string}.mp3` | undefined,
    head?: Array<string>
}

export type Dictionary = Map<string, Array<DictionaryWord>>
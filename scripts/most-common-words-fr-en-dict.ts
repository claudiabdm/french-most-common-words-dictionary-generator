import fs from 'fs';
import { BaseDictionary, Dictionary, DictionaryWord, KaikkiEntries, KaikkiWord, WordId } from './types';
import { mostCommonWordsLemmatize } from './most-common-words-fr-lemmatize';
import { kaikkiFrEnWords } from './kaikki-words-fr-en-entries';


const OUTPUT_DICT_PATH_FILE = './output/10000-most-common-words-en-fr-dict';

export async function generateMostCommonWordsFrEnDict() {
    printLog("⏳ Generating dictionary with the 10000 most common words...")
    const baseDictionary = await mostCommonWordsLemmatize()
    printLog("✅ Generating dictionary with the 10000 most common words\n")

    printLog("⏳ Generating dictionary for Kaikki words...")
    const kaikkiEntries: KaikkiEntries = await kaikkiFrEnWords();
    printLog(`✅ Generating dictionary for  ${kaikkiEntries.size} Kaikki words\n`);


    const logLine = "⏳ Adding Kaikki info to dictionary with the 10000 most common words..."
    printLog(logLine)
    const dictionary: Dictionary = generateDictionary(baseDictionary, kaikkiEntries, baseDictionary.size)

    printLog("✅ Adding Kaikki info to dictionary with the 10000 most common words\n")
    fs.writeFileSync(OUTPUT_DICT_PATH_FILE + '.json', JSON.stringify(Object.fromEntries([...dictionary].map(([k, v]) => [k, [...v]]))));
    printLog(`\n✨ You can find the ${dictionary.size} most commont words English-French dictionary in ${OUTPUT_DICT_PATH_FILE}.js and ${OUTPUT_DICT_PATH_FILE}.json ` + '\n')
}

function printLog(str: string) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(str);
}

function createNewWord(kaikkiWord: KaikkiWord, size = 0) {
    return {
        word: kaikkiWord.word,
        rank: size + 1,
        category: kaikkiWord.pos,
        pronunciation: kaikkiWord.sounds?.find(s => s.audio?.includes('LL-Q150'))?.ogg_url,
        senses: kaikkiWord.senses,
    }
}

function addWordEntry(mainDict: Dictionary, wordId: WordId, kaikkiWord: KaikkiWord, newWord: DictionaryWord) {
    // Group different entries for the same word
    if (!mainDict.has(kaikkiWord.word)) {
        const newMap: Map<WordId, DictionaryWord> = new Map();
        newMap.set(wordId, newWord);
        mainDict.set(kaikkiWord.word, newMap);
    } else {
        const wordInDict = mainDict.get(kaikkiWord.word)!;
        if (!wordInDict.has(wordId)) {
            wordInDict.set(wordId, newWord);
        }
    }
}

function generateDictionary(baseDictionary: BaseDictionary, kaikkiEntries: KaikkiEntries, baseDictionarySize: number) {
    const baseWords = baseDictionary.keys();
    const logLine = "⏳ Adding Kaikki info to dictionary with the 10000 most common words..."
    printLog(logLine)
    let counter = 0;
    const dictionary: Dictionary = new Map();
    for (const word of baseWords) {
        try {
            const kaikkiWords = kaikkiEntries[word.split('-')[0]];
            if (kaikkiWords) {
                kaikkiWords.forEach(w => {
                    const newWord = createNewWord(w, dictionary.size);
                    const wordId = newWord.word + '-' + newWord.category as WordId;
                    addWordEntry(dictionary, wordId, w, newWord);

                    if (w.antonyms?.length) {
                        w.antonyms.forEach(a => {
                            kaikkiEntries[a.word]?.forEach(aw => {
                                const newWord = createNewWord(aw, dictionary.size);
                                const wordId = newWord.word + '-' + newWord.category as WordId;
                                addWordEntry(dictionary, wordId, aw, newWord);
                            });
                        })
                    }
                })
            }
        }
        catch (err) {
            console.error(`Error parsing word: ${word}`, err);
        }
        counter += 1
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(logLine + ' ' + ((counter / baseDictionarySize) * 100).toFixed(2) + '%');
    }
    return dictionary;
}
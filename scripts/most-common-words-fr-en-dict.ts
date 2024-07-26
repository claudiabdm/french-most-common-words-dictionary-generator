import fs from 'fs';
import readline from 'readline';
import { Dictionary, KaikkiDictionary, KaikkiWord, WordId } from './types';
import { mostCommonWordsLemmatize } from './most-common-words-fr-lemmatize';

const KAIKKI_DICT_PATH_FILE = './resources/kaikki.org-dictionary-French.jsonl';
const OUTPUT_DICT_PATH_FILE = './output/10000-most-common-words-en-fr-dict.json';

export async function generateMostCommonWordsFrEnDict() {
    printLog("⏳ Generating dictionary with the 10000 most common words...")
    const baseDictionary = await mostCommonWordsLemmatize()
    const baseWords = baseDictionary.keys();
    printLog("✅ Generating dictionary with the 10000 most common words\n")

    printLog("⏳ Generating dictionary for Kaikki words...")
    const fileStream = fs.createReadStream(KAIKKI_DICT_PATH_FILE);
    const kaikkiDictionary: KaikkiDictionary = new Map();
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        try {
            const jsonObject: KaikkiWord = JSON.parse(line);
            const wordId = `${jsonObject.word}-${jsonObject.pos}` as WordId;
            kaikkiDictionary.set(wordId, jsonObject)
        } catch (err) {
            console.error(`Error parsing line: ${line}`, err);
        }
    }
    printLog(`✅ Generating dictionary for  ${kaikkiDictionary.size} Kaikki words\n`);


    const logLine = "⏳ Adding Kaikki info to dictionary with the 10000 most common words..."
    printLog(logLine)
    let counter = 0;
    const dictionary: Dictionary = new Map();
    const kaikkiEntries = Array.from(kaikkiDictionary.entries());
    for (const word of baseWords) {
        try {
            const dictWord = kaikkiDictionary.get(word);
            if (dictWord) {
                dictionary.set(word, {
                    word: dictWord.word,
                    rank: baseDictionary.get(word)!.rank,
                    category: dictWord.pos,
                    pronunciation: dictWord.sounds?.find(s => s.audio?.includes('LL-Q150'))?.ogg_url,
                    senses: dictWord.senses,
                })
            } else {
                // If it is not found, it might be because the word category didn't match Kaikki category.
                // Let's find the Kaikki word that equals to the base word but has different category
                const kaikkiEntry = kaikkiEntries.find(([kaikkiWord]) => {
                    const [kw, kc] = kaikkiWord.split('-');
                    const [w, c] = word.split('-');
                    return kw.toLowerCase() === w.toLowerCase() && kc.toLowerCase() !== c.toLowerCase()
                });
                if (kaikkiEntry) {
                    const [wordId, kaikkiWord] = kaikkiEntry
                    dictionary.set(wordId, {
                        word: kaikkiWord.word,
                        rank: baseDictionary.get(word)!.rank,
                        category: kaikkiWord.pos,
                        pronunciation: kaikkiWord.sounds?.find(s => s.audio?.includes('LL-Q150'))?.ogg_url,
                        senses: kaikkiWord.senses,
                    })
                }
            }
        }
        catch (err) {
            console.error(`Error parsing word: ${word}`, err);
        }
        counter += 1
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(logLine + ' ' + ((counter / baseDictionary.size) * 100).toFixed(2) + '%');

    }
    fs.writeFileSync(OUTPUT_DICT_PATH_FILE, JSON.stringify([...dictionary], null, 4));
    printLog("✅ Adding Kaikki info to dictionary with the 10000 most common words\n")
    printLog(`\n✨ You can find the ${dictionary.size} most commont words English-French dictionary in ${OUTPUT_DICT_PATH_FILE} ` + '\n')
}

function printLog(str: string) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(str);
}
import fs from 'fs';
import { Dictionary, KaikkiEntries, WordId } from './types';
import { mostCommonWordsLemmatize } from './most-common-words-fr-lemmatize';
import { kaikkiFrEnWords } from './kaikki-words-fr-en-entries';


const OUTPUT_DICT_PATH_FILE = './output/10000-most-common-words-en-fr-dict.json';

export async function generateMostCommonWordsFrEnDict() {
    printLog("⏳ Generating dictionary with the 10000 most common words...")
    const baseDictionary = await mostCommonWordsLemmatize()
    const baseWords = baseDictionary.keys();
    printLog("✅ Generating dictionary with the 10000 most common words\n")

    printLog("⏳ Generating dictionary for Kaikki words...")
    const kaikkiEntries: KaikkiEntries = await kaikkiFrEnWords();
    printLog(`✅ Generating dictionary for  ${kaikkiEntries.size} Kaikki words\n`);


    const logLine = "⏳ Adding Kaikki info to dictionary with the 10000 most common words..."
    printLog(logLine)
    let counter = 0;
    const dictionary: Dictionary = new Map();
    for (const word of baseWords) {
        try {
            const kaikkiWords = kaikkiEntries[word.split('-')[0]];
            if (kaikkiWords) {
                kaikkiWords.forEach(w => {
                    const wordId = w.word + '-' + w.pos as WordId;
                    dictionary.set(wordId, {
                        word: w.word,
                        rank: dictionary.size + 1,
                        category: w.pos,
                        pronunciation: w.sounds?.find(s => s.audio?.includes('LL-Q150'))?.ogg_url,
                        senses: w.senses,
                    })

                    if (w.antonyms?.length) {
                        w.antonyms.forEach(a => {
                            kaikkiEntries[a.word]?.forEach(aw => {
                                const awId = aw.word + '-' + aw.pos as WordId;
                                if (!dictionary.has(awId)) {
                                    dictionary.set(awId, {
                                        word: aw.word,
                                        rank: dictionary.size + 1,
                                        category: aw.pos,
                                        pronunciation: aw.sounds?.find(s => s.audio?.includes('LL-Q150'))?.ogg_url,
                                        senses: aw.senses,
                                    })
                                }
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
        process.stdout.write(logLine + ' ' + ((counter / baseDictionary.size) * 100).toFixed(2) + '%');

    }

    fs.writeFileSync(OUTPUT_DICT_PATH_FILE, JSON.stringify(Object.fromEntries(dictionary), null, 4));
    printLog("✅ Adding Kaikki info to dictionary with the 10000 most common words\n")
    printLog(`\n✨ You can find the ${dictionary.size} most commont words English-French dictionary in ${OUTPUT_DICT_PATH_FILE} ` + '\n')
}

function printLog(str: string) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(str);
}
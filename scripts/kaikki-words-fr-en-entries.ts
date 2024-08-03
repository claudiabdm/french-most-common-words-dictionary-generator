import fs from 'fs';
import readline from 'readline';
import { KaikkiEntries, KaikkiWord } from '../types';

const KAIKKI_DICT_PATH_FILE = './resources/kaikki.org-dictionary-French.jsonl';

export async function kaikkiFrEnWords() {
    const fileStream = fs.createReadStream(KAIKKI_DICT_PATH_FILE);
    const kaikkiEntries: KaikkiEntries = {};
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        try {
            const jsonObject: KaikkiWord = JSON.parse(line);
            const word = jsonObject.word;
            if (kaikkiEntries[word]) {
                kaikkiEntries[word].push(jsonObject)
            } else {
                kaikkiEntries[word] = [jsonObject]
            }
        } catch (err) {
            console.error(`Error parsing line: ${line}`, err);
        }
    }
    return kaikkiEntries;
}
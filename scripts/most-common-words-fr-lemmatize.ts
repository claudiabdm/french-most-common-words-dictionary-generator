import fs from 'fs';
import csv from 'csv-parser';
import { Category, legendLexiqueKaikki, CategoryKey, BaseDictionary, WordId } from './types';

const CSV_FILE_PATH = './resources/words-sorted-by-freq-lemme.csv'

export function mostCommonWordsLemmatize(): Promise<BaseDictionary>;
export function mostCommonWordsLemmatize(jsonFilePath: string): Promise<void>;
export function mostCommonWordsLemmatize(jsonFilePath?: string): Promise<BaseDictionary | void> {
    let counter = 1;
    // Use map to make sure the frequency rank is followed
    const jsonData: BaseDictionary = new Map();

    // Read the CSV file from http://www.lexique.org/
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(CSV_FILE_PATH)
        stream
            .pipe(csv())
            .on('data', (row) => {
                const [word, lemme, cgram] = row['Word;lemme;cgram;freqlemfilms2;freqfilms2;cgramortho;'].split(';');
                const category = legendLexiqueKaikki[cgram as CategoryKey] as Category;
                const wordId = `${word}-${category}` as WordId;
                if (category && lemme === word && !jsonData.has(wordId)) {
                    jsonData.set(
                        wordId,
                        {
                            word,
                            category,
                            rank: jsonData.size + 1,
                        })
                    counter += 1
                }
            })
            .on('end', () => {
                const mostCommon10000 = [...jsonData].slice(0, 10000)
                if (jsonFilePath) {
                    fs.writeFileSync(jsonFilePath, JSON.stringify(mostCommon10000, null, 4));
                    resolve()
                } else {
                    resolve(new Map(mostCommon10000));
                }
            })
            .on('error', (err) => {
                console.error('Error reading the CSV file:', err);
                reject(`Error reading the CSV file:, ${err}`)
            });
    })
}
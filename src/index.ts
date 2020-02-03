import fs from 'fs';
import path from 'path';

import generateRandom from './lib/generateRandom';
import { TrigramTable } from './types';
import Analytics from './analytics/trigram';

const asyncFs = fs.promises;

function createtrigramTableTable(text: string[]): TrigramTable {
  const trigramTable = new Map<string, string[]>();

  for (let i = 0; i < text.length; i++) {
    if (!(text[i + 1] && text[i + 2])) {
      break;
    }

    const key = `${text[i]} ${text[i + 1]}`;
    const value = trigramTable.get(key);

    if (value) {
      !value.includes(text[i + 2]) && value.push(text[i + 2]);
    } else {
      trigramTable.set(key, [text[i + 2]]);
    }
  }

  return trigramTable;
}

function handleInputText(text: string): string[] {
  const array = text.split(/\s/);
  // Splitting on newlines results in empty strings in the array.
  // let's strip those out.
  return array.filter(str => str !== '');
}

function selectNextWord(pair: string, trigramTable: TrigramTable) {
  const values = trigramTable.get(pair);
  if (!values) {
    return;
  }
  return values[generateRandom(values.length)];
}

function generateText(trigramTable: TrigramTable, maxLength: number) {
  const keys = Array.from(trigramTable.keys());
  const output: string[] = [];

  let pair = keys[generateRandom(keys.length)];
  let nextWord = selectNextWord(pair, trigramTable);
  if (!nextWord) {
    throw new Error('Something strange has happened.');
  }
  pair.split(' ').forEach(str => output.push(str));
  output.push(nextWord);

  // search for a pair that matches the last two words in the string
  // if it exists in the trigramTable, select a random next character.
  // else, return;
  while (output.length <= maxLength) {
    pair = `${output[output.length - 2]} ${output[output.length - 1]}`;
    nextWord = selectNextWord(pair, trigramTable);
    if (!nextWord) {
      return output.join(' ');
    }
    output.push(nextWord);
  }

  // TODO: consider punctuation.
  return output.join(' ');
}

async function run() {
  const text = await asyncFs.readFile(
    path.resolve(__dirname, '..', 'txt-source', 'test2.txt'),
    { encoding: 'utf8' }
  );

  const trigramTable = createtrigramTableTable(handleInputText(text));
  const lengthOccurrences = Analytics.getValueLengthOccurrances(trigramTable);

  // console.log('')
  for (const [len, occurrences] of lengthOccurrences.entries()) {
    console.log(`Pairs with ${len} potential follow: ${occurrences}`);
  }

  const output = generateText(trigramTable, 500);
  console.log('output: ', output);
}

run();

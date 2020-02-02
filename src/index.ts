import fs from 'fs';
import path from 'path';

import generateRandom from './lib/generateRandom';

const asyncFs = fs.promises;

function createTrigram(text: string[]): Map<string, string[]> {
  const trigram = new Map<string, string[]>();

  for (let i = 0; i < text.length; i++) {
    if (!(text[i + 1] && text[i + 2])) {
      break;
    }

    const key = `${text[i]} ${text[i + 1]}`;
    const value = trigram.get(key);

    if (value) {
      !value.includes(text[i + 2]) && value.push(text[i + 2]);
    } else {
      trigram.set(key, [text[i + 2]]);
    }
  }

  return trigram;
}

function handleInputText(text: string): string[] {
  const array = text.split(/\s/);
  // Splitting on newlines results in empty strings in the array.
  // let's strip those out.
  return array.filter(str => str !== '');
}

function selectNextWord(pair: string, trigram: Map<string, string[]>) {
  const values = trigram.get(pair);
  if (!values) {
    return;
  }
  return values[generateRandom(values.length)];
}

function generateText(trigram: Map<string, string[]>, maxLength: number) {
  const keys = Array.from(trigram.keys());
  const output: string[] = [];

  let pair = keys[generateRandom(keys.length)];
  let nextWord = selectNextWord(pair, trigram);
  if (!nextWord) {
    throw new Error('Something strange has happened.');
  }
  pair.split(' ').forEach(str => output.push(str));
  output.push(nextWord);

  // search for a pair that matches the last two words in the string
  // if it exists in the trigram, select a random next character.
  // else, return;
  while (output.length <= maxLength) {
    pair = `${output[output.length - 2]} ${output[output.length - 1]}`;
    nextWord = selectNextWord(pair, trigram);
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
    path.resolve(__dirname, '..', 'txt-source', 'test.txt'),
    { encoding: 'utf8' }
  );
  console.log('Input text: ', handleInputText(text));

  const trigram = createTrigram(handleInputText(text));
  console.log('trigram: ', trigram);

  const output = generateText(trigram, 20);
  console.log('output: ', output);
}

run();

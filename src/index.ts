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
      value.push(text[i + 2]);
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

function generateText(trigram: Map<string, string[]>, length: number) {
  const keys = Array.from(trigram.keys());
  let output = '';

  let words = 0;
  while (words + 3 <= length) {
    const key = keys[generateRandom(keys.length - 1)];
    const value = trigram.get(key);
    if (!value) {
      throw new Error('This should never happen, wtf');
    }

    const third = value[generateRandom(value.length - 1)];
    output += `${key} ${third} `;

    words += 3;
  }

  return output;
}

async function run() {
  const text = await asyncFs.readFile(
    path.resolve(__dirname, '..', 'txt-source', 'test.txt'),
    { encoding: 'utf8' }
  );
  console.log('Input text: ', handleInputText(text));

  const trigram = createTrigram(handleInputText(text));
  console.log('trigram: ', trigram);

  const output = generateText(trigram, 10);
  console.log('output: ', output);
}

run();

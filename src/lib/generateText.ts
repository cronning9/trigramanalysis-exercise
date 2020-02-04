import { TrigramTable } from '../types';
import getRandomNumber from './generateRandom';

function selectNextWord(pair: string, trigramTable: TrigramTable) {
  const values = trigramTable.get(pair);
  if (!values) {
    return;
  }
  return values[getRandomNumber(values.length)];
}

export default function generateText(trigramTable: TrigramTable, maxLength: number) {
  const keys = Array.from(trigramTable.keys());
  const output: string[] = [];

  let pair = keys[getRandomNumber(keys.length)];
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

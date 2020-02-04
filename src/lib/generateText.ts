import { TrigramTable } from '../types';
import getRandomNumber from './generateRandom';

const PUNC = ['.', '!', '?'];

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
  while (!/[A-Z]/.test(pair[0])) {
    pair = keys[getRandomNumber(keys.length)];
  }
  let nextWord = selectNextWord(pair, trigramTable);
  if (!nextWord) {
    throw new Error('Something strange has happened.');
  }
  pair.split(' ').forEach(str => output.push(str));
  output.push(nextWord);

  /**
   * Search for a pair that matches the last two words in the string
   * if it exists in the trigramTable, select a random next character.
   * else, return;
   *
   * Once we've reached that maxLength, we want to continue until we're
   * ending on punctuation.
   */
  while (output.length <= maxLength) {
    pair = `${output[output.length - 2]} ${output[output.length - 1]}`;
    nextWord = selectNextWord(pair, trigramTable);
    if (!nextWord) {
      return PUNC.includes(pair[pair.length - 1]) ? output.join(' ') : output.join(' ') + '.';
    }
    output.push(nextWord);
  }

  // TODO: consider punctuation.
  if (PUNC.includes(pair[pair.length - 1])) {
    return output.join(' ');
  } else {
    let ending = false;
    while (!ending) {
      pair = `${output[output.length - 2]} ${output[output.length - 1]}`;
      nextWord = selectNextWord(pair, trigramTable);
      if (!nextWord) {
        return PUNC.includes(pair[pair.length - 1]) ? output.join(' ') : output.join(' ') + '.';
      }
      output.push(nextWord);
      if (PUNC.includes(nextWord[nextWord.length - 1])) {
        ending = true;
      }
    }
  }

  return output.join(' ');
}

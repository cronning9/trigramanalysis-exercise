import fs from 'fs';
import path from 'path';

const asyncFs = fs.promises;

function createTrigram(text: string): Map<string, string[]> {
  const textArray = text.split(' ');
  const trigram = new Map<string, string[]>();

  for (let i = 0; i < textArray.length; i++) {
    if (!(textArray[i + 1] && textArray[i + 2])) {
      break;
    }

    const key = `${textArray[i]} ${textArray[i + 1]}`;
    const value = trigram.get(key);

    if (value) {
      value.push(textArray[i + 2]);
    } else {
      trigram.set(key, [textArray[i + 2]]);
    }
  }

  return trigram;
}

async function run() {
  const text = await asyncFs.readFile(
    path.resolve(__dirname, '..', 'txt-source', 'test.txt'),
    { encoding: 'utf8' }
  );
  console.log('Input text: ', text);

  const trigram = createTrigram(text);
  for (const [key, value] of trigram.entries()) {
    console.log(`${key} -> ${value}`);
  }
}

run();

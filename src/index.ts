import fs from 'fs';
import path from 'path';

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

async function run() {
  const text = await asyncFs.readFile(
    path.resolve(__dirname, '..', 'txt-source', 'test.txt'),
    { encoding: 'utf8' }
  );
  console.log('Input text: ', handleInputText(text));

  const trigram = createTrigram(handleInputText(text));
  for (const [key, value] of trigram.entries()) {
    console.log(`${key} -> ${value}`);
  }
}

run();

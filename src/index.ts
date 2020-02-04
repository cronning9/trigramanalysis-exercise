import fs from 'fs';
import path from 'path';

import generateText from './lib/generateText';
import createTrigramTable from './lib/createTrigramTable';
import Analytics from './analytics/trigram';

const asyncFs = fs.promises;

async function run(sources: string[]) {
  let text = '';
  for (const src of sources) {
    const txt = await asyncFs.readFile(
      path.resolve(__dirname, '..', 'txt-source', src),
      {
        encoding: 'utf8'
      }
    );
    text += `${txt} `;
  }

  const trigramTable = createTrigramTable(
    // Splitting on newlines results in empty strings in the array.
    // let's strip those out.
    text.split(/\s/).filter(str => str !== '')
  );
  const lengthOccurrences = Analytics.getValueLengthOccurrances(trigramTable);

  // console.log('')
  for (const [len, occurrences] of lengthOccurrences.entries()) {
    console.log(`Pairs with ${len} potential follow: ${occurrences}`);
  }

  const output = generateText(trigramTable, 400);
  console.log('output: ', output);
}

function entryPoint() {
  const texts = process.argv.slice(2);
  run(texts);
}

entryPoint();

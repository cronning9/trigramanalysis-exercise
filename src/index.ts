import fs from 'fs';
import path from 'path';

const asyncFs = fs.promises;

async function run() {
  const text = await asyncFs.readFile(
    path.resolve(__dirname, '..', 'txt-source', 'test.txt'),
    { encoding: 'utf8' }
  );
  console.log(text);
}

run();

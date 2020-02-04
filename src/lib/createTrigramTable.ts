import { TrigramTable } from '../types';

export default function createTrigramTable(text: string[]): TrigramTable {
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

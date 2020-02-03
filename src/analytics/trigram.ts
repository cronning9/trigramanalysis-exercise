import { TrigramTable } from '../types';

function getValueLengthOccurrances(trigramTable: TrigramTable) {
  const map = new Map<number, number>();
  for (const list of trigramTable.values()) {
    const len = list.length;
    const value = map.get(len);
    if (value) {
      map.set(len, value + 1);
    } else {
      map.set(len, 1);
    }
  }

  const temp = Array.from(map.entries());
  const sortedMap = new Map(
    temp.sort((x, y) => {
      if (x[0] < y[0]) {
        return -1;
      }
      if (x[0] > y[0]) {
        return 1;
      }
      return 0;
    })
  );

  return sortedMap;
}

export default {
  getValueLengthOccurrances
};

import TrigramAnalytics from './trigram';
import { TrigramTable } from '../types';

export default function runAnalytics(trigramTable: TrigramTable) {
  const lengthOccurrences = TrigramAnalytics.getValueLengthOccurrances(trigramTable);

  // console.log('')
  for (const [len, occurrences] of lengthOccurrences.entries()) {
    console.log(`Pairs with ${len} potential follow: ${occurrences}`);
  }
}

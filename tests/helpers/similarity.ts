import * as levenshtein from 'fast-levenshtein';

export function calculateSimilarity(str1: string, str2: string): number {
  const distance: number = levenshtein.get(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 100;
  return (1 - distance / maxLen) * 100;
}

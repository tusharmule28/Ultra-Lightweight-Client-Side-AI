// Sentence tokenizer. 
// Handles abbreviations, decimals, and ellipses to avoid false splits.

const ABBREVS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'vs', 'etc',
  'eg', 'ie', 'fig', 'approx', 'dept', 'est', 'inc', 'corp',
  'ltd', 'co', 'gov', 'no', 'vol', 'rev', 'gen', 'sgt', 'col',
  'ave', 'blvd', 'st', 'rd', 'tech', 'eng',
]);

export function splitIntoSentences(text) {
  if (!text || typeof text !== 'string') return [];

  const raw = text.replace(/\s+/g, ' ').trim();
  if (!raw) return [];

  const tokens = raw.split(/(?<=[.?!])\s+/);
  const sentences = [];
  let current = '';

  for (const token of tokens) {
    if (!token) continue;
    if (!current) {
      current = token;
      continue;
    }

    const lastWord = current
      .trim()
      .split(/\s+/)
      .pop()
      ?.replace(/\.$/, '')
      .toLowerCase();

    // don't split on abbreviations or decimals
    if (ABBREVS.has(lastWord) || /\d+\.$/.test(current.trim()) || current.trimEnd().endsWith('..')) {
      current += ' ' + token;
      continue;
    }

    sentences.push(current.trim());
    current = token;
  }

  if (current.trim()) sentences.push(current.trim());

  return sentences.filter(s => s.length > 5);
}

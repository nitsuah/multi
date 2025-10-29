export function getBadWordsFromEnv(envVar) {
  if (!envVar) return null;
  return envVar.split(',').map((w) => w.trim()).filter(Boolean);
}

export function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function filterText(text, badWords) {
  if (!text) return text;
  let filtered = text;
  badWords.forEach((word) => {
    const re = new RegExp(escapeRegex(word), 'gi');
    filtered = filtered.replace(re, '*'.repeat(word.length));
  });
  return filtered;
}

export default { getBadWordsFromEnv, filterText, escapeRegex };

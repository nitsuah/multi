import {
  BAD_WORDS,
  escapeRegex,
  filterProfanity,
} from "../src/lib/constants/profanity.ts";

export function getBadWordsFromEnv(envVar) {
  if (!envVar) return [...BAD_WORDS]; // Use shared constant as default
  return envVar
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);
}

export function filterText(text, customWords = null) {
  // If custom words provided from env, use them; otherwise use shared BAD_WORDS
  const wordsToUse = customWords || [...BAD_WORDS];
  return filterProfanity(text, customWords ? wordsToUse : []);
}

// Re-export for backwards compatibility
export { escapeRegex, filterProfanity };

export default { getBadWordsFromEnv, filterText, escapeRegex, filterProfanity };

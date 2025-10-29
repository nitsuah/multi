export function getBadWordsFromEnv(envVar: string): string[] | null;
export function escapeRegex(s: string): string;
export function filterText(text: string, badWords: string[]): string;

declare const _default: {
  getBadWordsFromEnv: typeof getBadWordsFromEnv;
  filterText: typeof filterText;
  escapeRegex: typeof escapeRegex;
};
export default _default;

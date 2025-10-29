import { describe, it, expect } from "vitest";
import {
  filterText,
  escapeRegex,
  getBadWordsFromEnv,
} from "../../server/profanity.js";

describe("profanity utility", () => {
  it("parses env var into list", () => {
    const list = getBadWordsFromEnv("bad, worse, awful");
    expect(list).toEqual(["bad", "worse", "awful"]);
  });

  it("escapes regex special characters", () => {
    const escaped = escapeRegex("a.b*c");
    expect(escaped).toBe("a\\.b\\*c");
  });

  it("filters words in text", () => {
    const text = "this is bad and awful";
    const filtered = filterText(text, ["bad", "awful"]);
    expect(filtered).toBe("this is *** and *****");
  });
});

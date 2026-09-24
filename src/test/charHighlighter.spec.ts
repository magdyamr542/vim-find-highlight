import { CharColoring, CharHighlighter } from "../charHighlighter";

describe("Char highlighter testing", () => {
  const service = new CharHighlighter();

  const testHelper = (
    charColoring: CharColoring,
    text: string,
    shouldChar: string,
    shouldJumps: number,
  ) => {
    expect(charColoring.minTimesToReach).toEqual(shouldJumps);
    expect(text.charAt(charColoring.position)).toEqual(shouldChar);
  };

  describe("Handles basic cases", () => {
    it("should get first letter of each word when the words don't share common chars", () => {
      const line = " first ok why";
      const result = service.getCharHighlighting(line, 0);
      expect(result).toHaveLength(3);

      testHelper(result[0], line, "f", 1);

      testHelper(result[1], line, "o", 1);

      testHelper(result[2], line, "w", 1);
    });

    it("should skip the current word when the cursor is on it", () => {
      const line = "first ok why";
      const result = service.getCharHighlighting(line, 0);
      expect(result).toHaveLength(2);
      testHelper(result[0], line, "o", 1);

      testHelper(result[1], line, "w", 1);
    });
  });

  describe("Handles repeated chars", () => {
    it("should require more than one jump when a word is repeated", () => {
      const line = " test test test";
      const result = service.getCharHighlighting(line, 0);
      expect(result).toHaveLength(3);

      testHelper(result[0], line, "t", 1);

      testHelper(result[1], line, "e", 2);

      testHelper(result[2], line, "e", 3);
    });

    it("should pick the char that makes it so fast to go to word", () => {
      const line = " tesst  ttttttttstttttte";
      const result = service.getCharHighlighting(line, 0);
      expect(result).toHaveLength(2);

      testHelper(result[0], line, "t", 1);
      testHelper(result[1], line, "e", 2);
    });

    it("should require more than one jump when a word is repeated before the cursor", () => {
      const line = "test test test x";
      const result = service.getCharHighlighting(line, line.indexOf("x"));
      expect(result).toHaveLength(3);

      // closest repeat of "test" to the cursor needs the fewest jumps, farthest needs the most
      testHelper(result[0], line, "e", 1);
      testHelper(result[1], line, "e", 2);
      testHelper(result[2], line, "e", 3);
    });
  });

  describe("Handles word characters", () => {
    it("should treat digits and underscores as part of the word, not as separators", () => {
      // if digits/underscores were treated as separators, these would split into
      // more (and different) words than the 3 expected here
      const line = " first1 ok_2 why_3";
      const result = service.getCharHighlighting(line, 0);
      expect(result).toHaveLength(3);

      testHelper(result[0], line, "f", 1);
      testHelper(result[1], line, "o", 1);
      testHelper(result[2], line, "w", 1);
    });
  });

  describe("Handles large input", () => {
    it("should resolve a long repeated-character word quickly and correctly", () => {
      const wordLength = 20000;
      const line = "a".repeat(wordLength) + " x";
      const cursorPos = line.indexOf("x");

      const start = process.hrtime.bigint();
      const result = service.getCharHighlighting(line, cursorPos);
      const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;

      // a quadratic implementation would take seconds here; a generous bound
      // catches a regression without being flaky on slower CI machines.
      expect(elapsedMs).toBeLessThan(1000);

      expect(result).toHaveLength(1);
      testHelper(result[0], line, "a", 1);
      expect(result[0].position).toEqual(wordLength - 1);
    });
  });

  describe("Handles edge cases", () => {
    it("should return empty array for empty line", () => {
      const line = "";
      const result = service.getCharHighlighting(line, 0);
      expect(result).toHaveLength(0);
    });

    it("should return empty array for one word when the cursor is on it", () => {
      const line = "oneWord";
      const result = service.getCharHighlighting(line, 3);
      expect(result).toHaveLength(0);
    });
  });

  describe("Handles different cursor positions", () => {
    it("should succeed regardless of the cursor position. End Case ", () => {
      const line = "first second ";
      const result = service.getCharHighlighting(line, line.length);
      expect(result).toHaveLength(2);
      testHelper(result[0], line, "s", 1);
      testHelper(result[1], line, "f", 1);
    });

    it("should succeed regardless of the cursor position. Middle Case ", () => {
      const line = "first test  second test";
      const result = service.getCharHighlighting(line, 11);
      expect(result).toHaveLength(4);

      testHelper(result[0], line, "e", 1);
      testHelper(result[1], line, "f", 1);
      testHelper(result[2], line, "s", 1);
      testHelper(result[3], line, "t", 1);
    });
  });
});

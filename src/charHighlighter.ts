const WORD_CHAR_REGEX = /\w/;
const NON_WORD_CHAR_REGEX = /(\W)/gi;

// a "word" here just needs at least one word character (e.g. "3" or "_" counts)
const containsWordChar = (str: string) => WORD_CHAR_REGEX.test(str);

export interface CharPosition {
  positions: number[]; // ascending, since built by scanning the line left to right
}
export interface CharColoring {
  position: number;
  minTimesToReach: number;
}

export type WordDirection = "before" | "after";

export interface WordWithIndex {
  word: string;
  startIndex: number;
}

export interface DirectedWord extends WordWithIndex {
  direction: WordDirection;
}

export interface LineWords {
  beforeCursor: DirectedWord[];
  afterCursor: DirectedWord[];
}

// counts how many entries of a sorted (ascending) array fall within [low, high]
const countInRange = (
  sortedPositions: number[],
  low: number,
  high: number
): number => {
  if (low > high) {
    return 0;
  }
  return lowerBound(sortedPositions, high + 1) - lowerBound(sortedPositions, low);
};

// index of the first element >= target (binary search)
const lowerBound = (sortedValues: number[], target: number): number => {
  let low = 0;
  let high = sortedValues.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (sortedValues[mid] < target) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
};

export class CharHighlighter {
  public getCharHighlighting(
    lineText: string,
    cursorPos: number
  ): CharColoring[] {
    const frequencyMap = this.getCharFrequencyMap(lineText);
    return this.getCharPosToColor(frequencyMap, lineText, cursorPos);
  }

  private getCharPosToColor(
    frequencyMap: Map<string, CharPosition>,
    text: string,
    cursorPos: number
  ): CharColoring[] {
    // for each word select index of char which should be colored
    const result: CharColoring[] = [];
    const { beforeCursor, afterCursor } = this.getWordsWithIndexes(
      text,
      cursorPos
    );
    if (beforeCursor.length === 0 && afterCursor.length === 0) {
      return [];
    }
    for (const word of beforeCursor.reverse().concat(afterCursor)) {
      result.push(this.getCharColoring(frequencyMap, word, cursorPos));
    }
    return result.filter((w) => w.position !== -1);
  }

  // range (inclusive) of positions that count as "reachable in one jump" for this word,
  // relative to the cursor, depending on which side of the cursor the word sits on
  private getReachableRange(
    word: DirectedWord,
    cursorPos: number,
    actualPos: number
  ): [low: number, high: number] {
    return word.direction === "before"
      ? [actualPos, cursorPos - 1]
      : [cursorPos + 1, actualPos];
  }

  private getCharColoring(
    frequencyMap: Map<string, CharPosition>,
    word: DirectedWord,
    cursorPos: number
  ): CharColoring {
    let minFreqForChar = Number.MAX_VALUE;
    let indexOfCharWithMinFreq = -1;

    for (const [index, char] of word.word.split("").entries()) {
      const charPosition = frequencyMap.get(char);
      const actualPos = word.startIndex + index;

      if (!charPosition) {
        return {
          position: actualPos,
          minTimesToReach: 1,
        }; // this char is okay to use to reach the word (single jump)
      }

      const [low, high] = this.getReachableRange(word, cursorPos, actualPos);
      const freq = countInRange(charPosition.positions, low, high); // all occurrences reachable from the cursor in one jump

      if (freq <= 1) {
        return {
          position: actualPos,
          minTimesToReach: 1,
        }; // this char is okay to use to reach the word (single jump)
      }

      // we can not reach the word using this char with one jump so maybe it works with next char.
      if (freq < minFreqForChar) {
        minFreqForChar = freq;
        indexOfCharWithMinFreq = actualPos;
      }
    }

    return {
      position: indexOfCharWithMinFreq,
      minTimesToReach: minFreqForChar,
    };
  }

  private getWordsWithIndexes(text: string, cursorPos: number): LineWords {
    const result: LineWords = { beforeCursor: [], afterCursor: [] };

    const insertWord = (word: WordWithIndex) => {
      if (!containsWordChar(word.word)) {
        return;
      }
      if (word.startIndex > cursorPos) {
        result.afterCursor.push({ ...word, direction: "after" });
      } else if (word.startIndex + word.word.length < cursorPos) {
        result.beforeCursor.push({ ...word, direction: "before" });
      }
    };

    let startIndex = 0;
    for (const token of text.split(NON_WORD_CHAR_REGEX)) {
      insertWord({ word: token, startIndex });
      startIndex += token.length;
    }

    return result;
  }

  // returns for every char the (ascending) positions it has been seen at
  private getCharFrequencyMap(text: string): Map<string, CharPosition> {
    const map: Map<string, CharPosition> = new Map();
    for (const [index, char] of text.split("").entries()) {
      const existing = map.get(char);
      if (existing) {
        existing.positions.push(index);
      } else {
        map.set(char, { positions: [index] });
      }
    }
    return map;
  }
}

export const charHighlighter = new CharHighlighter();

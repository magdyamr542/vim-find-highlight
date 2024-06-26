const isAlphabetic = (str: string) => {
  const wordRegex = /\w/gi;
  return wordRegex.test(str);
};

export interface CharPosition {
  positions: number[];
}
export interface CharColoring {
  position: number;
  minTimesToReach: number;
}

export interface WordWithIndex {
  word: string;
  startIndex: number;
}

export interface WordWithIndexWithCompareFunc extends WordWithIndex {
  compare: (charPos: number, cursorPos: number, actualPos: number) => boolean;
}

export interface LineWords {
  beforeCursor: WordWithIndexWithCompareFunc[];
  afterCursor: WordWithIndexWithCompareFunc[];
}

export interface ICharHighlighter {
  getCharHighlighting: (lineText: string, cursorPos: number) => CharColoring[];
}

export class CharHighlighter implements ICharHighlighter {
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

  private getCharColoring(
    frequencyMap: Map<string, CharPosition>,
    word: WordWithIndexWithCompareFunc,
    cursorPos: number
  ): CharColoring {
    let minFreqForChar = Number.MAX_VALUE;
    let indexOfCharWithMinFreq = -1;

    for (const [index, char] of word.word.split("").entries()) {
      const mapHasChar = frequencyMap.has(char);
      const actualPos = word.startIndex + index;

      if (!mapHasChar) {
        return {
          position: actualPos,
          minTimesToReach: 1,
        }; // this char is okay to use to reach the word (single jump)
      }

      const positions = frequencyMap.get(char);
      const freq = positions!.positions.filter((p) =>
        word.compare(p, cursorPos, actualPos)
      ).length; // all occurrences of the char after the cursor

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
      if (!isAlphabetic(word.word)) {
        return;
      }
      if (word.startIndex > cursorPos) {
        result.afterCursor.push({
          ...word,
          compare: (charPos, cursorPosition, actualPos) =>
            charPos > cursorPosition && charPos <= actualPos,
        });
      } else if (word.startIndex + word.word.length < cursorPos) {
        result.beforeCursor.push({
          ...word,
          compare: (charPos, cursorPosition, actualPos) =>
            charPos < cursorPosition && charPos >= actualPos,
        });
      }
    };
    const notWordRegex = /(\W)/gi;
    text
      .split(notWordRegex)
      .reduce<WordWithIndex[]>((prev, currWord, index) => {
        if (index === 0) {
          prev.push({ word: currWord, startIndex: 0 });
          insertWord({ word: currWord, startIndex: 0 });
          return prev;
        }
        const startIndex =
          prev[index - 1].startIndex + prev[index - 1].word.length;
        prev.push({ word: currWord, startIndex });
        insertWord({ word: currWord, startIndex });
        return prev;
      }, []);
    return result;
  }
  // returns for every char where it has been seen before
  private getCharFrequencyMap(text: string) {
    const map: Map<string, CharPosition> = new Map();
    text.split("").forEach((char, index) => {
      if (map.has(char)) {
        map.set(char, { positions: [...map.get(char)!.positions, index] });
      } else {
        map.set(char, { positions: [index] });
      }
    });
    return map;
  }
}

export const charHighlighter = new CharHighlighter();

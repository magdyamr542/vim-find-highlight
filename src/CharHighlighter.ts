import { isAlphabetic } from "./utils";

export interface CharPosition {
	positions: number[];
}
export interface CharColoring {
	color: string;
	position: number;
}

export interface WordWithIndex {
	word: string;
	startIndex: number;
}

export interface WordWithIndexWithCompareFunc extends WordWithIndex {
	compare: (charPos: number, cursorPos: number, actualPos: number) => boolean;
}

export interface ICharHighlighter {
	getCharHighlighting: (lineText: string, cursorPos: number) => CharColoring[];
}
export class CharHighlighter implements ICharHighlighter {
	public getCharHighlighting(lineText: string, cursorPos: number): CharColoring[] {
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
		const wordsWithIndexes = this.getWordsWithIndexes(text);
		if (wordsWithIndexes.length == 0) {
			return [];
		}
		const wordsAfterCursor = wordsWithIndexes.filter((word) => word.startIndex > cursorPos);
		const wordsBeforeCursor = wordsWithIndexes.filter((word) => word.startIndex + word.word.length < cursorPos);

		const before: WordWithIndexWithCompareFunc[] = wordsBeforeCursor.map(w => {
			return { word: w.word, startIndex: w.startIndex, compare: (charPos, cursorPosition, actualPos) => charPos < cursorPosition && charPos >= actualPos }
		})
		const after: WordWithIndexWithCompareFunc[] = wordsAfterCursor.map(w => {
			return { word: w.word, startIndex: w.startIndex, compare: (charPos, cursorPosition, actualPos) => charPos > cursorPosition && charPos <= actualPos }
		})

		for (const word of before.reverse().concat(after)) {
			result.push(
				this.getCharColoring(frequencyMap, word, cursorPos)
			);
		}
		return result.filter(w => w.position !== -1);
	};

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
				return { color: "red", position: actualPos }; // this char is okay to use to reach the word
			}

			const positions = frequencyMap.get(char);
			const freq = positions!.positions.filter(p => word.compare(p, cursorPos, actualPos)).length; // all occurrences of the char after the cursor

			if (freq === 0) {
				return { color: "red", position: actualPos }; // this char is okay to use to reach the word
			}

			// we can not reach the word using this char with one jump so maybe it works with next char.
			if (freq < minFreqForChar) {
				minFreqForChar = freq;
				indexOfCharWithMinFreq = actualPos;
			}
		}

		return { color: "red", position: indexOfCharWithMinFreq };

	}
	private getWordsWithIndexes(text: string): WordWithIndex[] {
		const allWords = text.split(/(\W)/gi).reduce<{ word: string; startIndex: number }[]>(
			(prev, currWord, index) => {
				if (index === 0) {
					prev.push({ word: currWord, startIndex: 0 });
					return prev;
				}
				const startIndex =
					prev[index - 1].startIndex + prev[index - 1].word.length;
				prev.push({ word: currWord, startIndex });
				return prev;
			},
			[]
		);
		return allWords.filter(word => isAlphabetic(word.word));
	};
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
	};
}

export const charHighlighter = new CharHighlighter();
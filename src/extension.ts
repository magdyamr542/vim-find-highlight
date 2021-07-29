import * as vscode from "vscode";
import { disposeCharDecoration, getCharDecoration } from "./decoration";
import { doesStringMatch } from "./utils";

interface CharPosition {
	positions: number[];
}
interface CharColoring {
	color: string;
	position: number;
}

interface WordWithIndex {
	word: string;
	startIndex: number;
}

const getCurrentLine = () => {
	const activeEditor = getActiveEditor();
	const res = activeEditor?.document.lineAt(activeEditor?.selection.active.line);
	return res;
};

const getActiveEditor = () => {
	return vscode.window.activeTextEditor;
}

const getCursorPos = () => {
	return getActiveEditor()?.selection.active.character;

};

export function activate(context: vscode.ExtensionContext) {
	let timeout: NodeJS.Timer | undefined = undefined;

	const debouncedMain = (cursorPos: number, text: string) => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(() => main(cursorPos, text), 500);
	}

	// register event when the user types something
	vscode.workspace.onDidChangeTextDocument((e) => {
		const line = getCurrentLine();
		const cursorPos = getCursorPos();
		if (line?.text.length && cursorPos) {
			debouncedMain(cursorPos, line.text);
		} else {
			disposeCharDecoration();
		}
	});

	vscode.window.onDidChangeTextEditorSelection((e) => {
		const line = getCurrentLine();
		const cursorPos = e.textEditor.selection.active.character;
		if (line?.text.length) {
			debouncedMain(cursorPos, line.text);
		} else {
			disposeCharDecoration();
		}
	});
}

const main = (cursorPos: number, currentLine: string) => {
	const frequencyMap = getCharFrequencyMap(currentLine);
	const toColorAfter = getCharPosToColor(frequencyMap, currentLine, cursorPos);
	for (const char of toColorAfter) {
		console.log(`will color char ${currentLine[char.position]}`);
	}
	colorChars(toColorAfter)
};


function colorChars(toColor: CharColoring[]) {
	const editor = getActiveEditor();
	if (!editor) {
		return;
	}
	const decorations: vscode.DecorationOptions[] = [];
	const line = getCurrentLine()
	for (const word of toColor) {
		if (line) {
			const startPos = new vscode.Position(line.lineNumber, word.position)
			const endPos = new vscode.Position(line.lineNumber, word.position + 1)
			decorations.push({ range: new vscode.Range(startPos, endPos) })
		} else {
			console.log("No line return");
		}
	}
	editor.setDecorations(getCharDecoration(), decorations);
}

const getCharPosToColor = (
	frequencyMap: Map<string, CharPosition>,
	text: string,
	cursorPos: number
): CharColoring[] => {
	// for each word select index of char which should be colored
	const result: CharColoring[] = [];
	const wordsWithIndexes = getWordsWithIndexes(text).filter(s => doesStringMatch(s.word, ".", ",", " ", "") === false);

	const wordsAfterCursor = wordsWithIndexes.filter((word) => word.startIndex > cursorPos);
	const wordsBeforeCursor = wordsWithIndexes.filter((word) => word.startIndex + word.word.length < cursorPos);

	console.log({ wordsWithIndexes });
	console.log(`Words after cursor: ${wordsAfterCursor.map(w => w.word)}`);
	console.log(`Words before cursor: ${wordsBeforeCursor.map(w => w.word)}`);

	for (const word of wordsBeforeCursor.reverse()) {
		result.push(
			getCharColoringBefore(frequencyMap, word.word, word.startIndex, cursorPos)
		);
	}

	for (const word of wordsAfterCursor) {
		result.push(
			getCharColoring(frequencyMap, word.word, word.startIndex, cursorPos)
		);
	}

	console.log("Char coloring map is", result)
	return result.filter(w => w.position !== -1);
};

const getCharColoringBefore = (frequencyMap: Map<string, CharPosition>,
	word: string,
	startIndex: number,
	cursorPos: number
): CharColoring => {

	let minFreqForChar = Number.MAX_VALUE;
	let indexOfCharWithMinFreq = -1;

	for (const [index, char] of word.split("").entries()) {

		const mapHasChar = frequencyMap.has(char);
		const actualPos = startIndex + index;

		if (!mapHasChar) {
			return { color: "red", position: actualPos }; // this char is okay to use to reach the word
		}

		const positions = frequencyMap.get(char);

		const freq = positions!.positions.filter((p) => p < cursorPos && p >= actualPos).length; // all occurrences of the char after the cursor

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
const getCharColoring = (
	frequencyMap: Map<string, CharPosition>,
	word: string,
	startIndex: number,
	cursorPos: number
): CharColoring => {

	let minFreqForChar = Number.MAX_VALUE;
	let indexOfCharWithMinFreq = -1;

	for (const [index, char] of word.split("").entries()) {

		const mapHasChar = frequencyMap.has(char);
		const actualPos = startIndex + index;

		if (!mapHasChar) {
			return { color: "red", position: actualPos }; // this char is okay to use to reach the word
		}

		const positions = frequencyMap.get(char);

		const freq = positions!.positions.filter((p) => p > cursorPos && p <= actualPos).length; // all occurrences of the char after the cursor

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
};

const getWordsWithIndexes = (text: string): WordWithIndex[] => {
	return text.split(/([\s.,]+)/gi).reduce<{ word: string; startIndex: number }[]>(
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
};
// returns for every char where it has been seen before
const getCharFrequencyMap = (text: string) => {
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

// this method is called when your extension is deactivated
export function deactivate() { }


import * as vscode from "vscode";
import { CharColoring } from "./CharHighlighter";
import { getCharDecoration } from "./decoration";

export const isAlphabetic = (str: string) => {
	const regex = /\w/gi
	return regex.test(str)
}

export const getCurrentLine = () => {
	const activeEditor = getActiveEditor();
	const res = activeEditor?.document.lineAt(activeEditor?.selection.active.line);
	return res;
};

export const getActiveEditor = () => {
	return vscode.window.activeTextEditor;
}

export const getCursorPos = () => {
	return getActiveEditor()?.selection.active.character;
};

export const colorChars = (toColor: CharColoring[]) => {
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

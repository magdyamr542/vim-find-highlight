import * as vscode from "vscode";
import { CharColoring } from "./CharHighlighter";
import { DecorationConfig, disposeCharDecoration, getCharDecoration, getCharDecorationSecondColor } from "./decoration";

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

export const colorChars = (toColor: CharColoring[], decorationConfig: DecorationConfig) => {
	const editor = getActiveEditor();
	if (!editor) {
		return;
	}
	const firstColorDecorations: vscode.DecorationOptions[] = []
	const secondColorDecorations: vscode.DecorationOptions[] = []

	const line = getCurrentLine()
	for (const word of toColor) {
		if (line) {
			const startPos = new vscode.Position(line.lineNumber, word.position)
			const endPos = new vscode.Position(line.lineNumber, word.position + 1)
			if (word.minTimesToReach > 1) {
				secondColorDecorations.push({ range: new vscode.Range(startPos, endPos) })
			} else {
				firstColorDecorations.push({ range: new vscode.Range(startPos, endPos) })
			}
		} else {
			console.log("No line return");
		}
	}
	editor.setDecorations(getCharDecoration(decorationConfig.firstColor), firstColorDecorations);
	editor.setDecorations(getCharDecorationSecondColor(decorationConfig.secondColor), secondColorDecorations);
}

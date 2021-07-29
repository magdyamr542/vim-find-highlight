import * as vscode from "vscode";
import { charHighlighter } from "./CharHighlighter";
import { disposeCharDecoration } from "./decoration";
import { colorChars, getCurrentLine, getCursorPos } from "./utils";

export function activate(_: vscode.ExtensionContext) {
	let timeout: NodeJS.Timer | undefined = undefined;

	const debouncedMain = (cursorPos: number, text: string) => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(() => main(cursorPos, text), 500);
	}

	// when the user types
	vscode.workspace.onDidChangeTextDocument((e) => {
		const line = getCurrentLine();
		const cursorPos = getCursorPos();
		if (line?.text.length && cursorPos) {
			debouncedMain(cursorPos, line.text);
		} else {
			disposeCharDecoration();
		}
	});

	// when the cursor moves 
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
	const toColor = charHighlighter.getCharHighlighting(currentLine, cursorPos);
	colorChars(toColor);
};

// this method is called when your extension is deactivated
export function deactivate() { }



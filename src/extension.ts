import * as vscode from "vscode";
import { charHighlighter } from "./CharHighlighter";
import { DEBOUNCE_TIMEOUT } from "./constants";
import { decorationConfig, disposeCharDecoration } from "./decoration";
import { colorChars, getCurrentLine, getCursorPos } from "./utils";

export function activate(context: vscode.ExtensionContext) {
	let timeout: NodeJS.Timer | undefined = undefined;

	const debouncedMain = (cursorPos: number, text: string) => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(() => main(cursorPos, text), DEBOUNCE_TIMEOUT);
	}

	// register change font weight command
	context.subscriptions.push(vscode.commands.registerCommand("extension.setHighlightedCharFontWeight", async e => {
		const fontWeight = await vscode.window.showQuickPick(["100", "200", "300", "400", "500", "600", "700", "800", "900"], { placeHolder: "Enter a font weight for the highlighted char" })
		if (fontWeight) {
			decorationConfig.fontWeight = fontWeight;
			disposeCharDecoration();
		}
	}))


	// register change color commands
	context.subscriptions.push(vscode.commands.registerCommand("extension.setHighlightPrimaryColor", async e => {
		const color = await vscode.window.showInputBox({
			placeHolder: "Enter a primary char highlight color",
			value: decorationConfig.firstColor,
		})
		if (color) {
			decorationConfig.firstColor = color;
			disposeCharDecoration();
		}
	}))


	// register change color commands
	context.subscriptions.push(vscode.commands.registerCommand("extension.setHighlightSecondaryColor", async e => {
		const color = await vscode.window.showInputBox({
			placeHolder: "Enter a secondary char highlight color",
			value: decorationConfig.secondColor
		})
		if (color) {
			decorationConfig.secondColor = color;
			disposeCharDecoration();
		}
	}))

	// when the user types
	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => {
		const line = getCurrentLine();
		const cursorPos = getCursorPos();
		if (line?.text.length && cursorPos) {
			debouncedMain(cursorPos, line.text);
		} else {
			disposeCharDecoration();
		}
	}))

	// when the cursor moves 
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((e) => {
		const line = getCurrentLine();
		const cursorPos = e.textEditor.selection.active.character;
		if (line?.text.length) {
			debouncedMain(cursorPos, line.text);
		} else {
			disposeCharDecoration();
		}
	}))
}

const main = (cursorPos: number, currentLine: string) => {
	const toColor = charHighlighter.getCharHighlighting(currentLine, cursorPos);
	colorChars(toColor, decorationConfig);
};

// this method is called when your extension is deactivated
export function deactivate() { }



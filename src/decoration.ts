
import * as vscode from "vscode";

let charDecoration: vscode.TextEditorDecorationType | undefined;
let charDecorationSecondColor: vscode.TextEditorDecorationType | undefined;

export const disposeCharDecoration = () => {
	charDecoration && charDecoration.dispose();
	charDecorationSecondColor && charDecorationSecondColor.dispose();
	charDecoration = undefined;
	charDecorationSecondColor = undefined;
}

export const getCharDecoration = () => {
	if (!charDecoration) {
		charDecoration = vscode.window.createTextEditorDecorationType({
			color: "red"
		})
		return charDecoration;
	}
	return charDecoration;
}

export const getCharDecorationSecondColor = () => {
	if (!charDecorationSecondColor) {
		charDecorationSecondColor = vscode.window.createTextEditorDecorationType({
			color: "yellow"
		})
		return charDecorationSecondColor;
	}
	return charDecorationSecondColor;
}
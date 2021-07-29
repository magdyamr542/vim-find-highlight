
import * as vscode from "vscode";

let charDecoration: vscode.TextEditorDecorationType | undefined;

export const disposeCharDecoration = () => {
	charDecoration && charDecoration.dispose();
	charDecoration = undefined;
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
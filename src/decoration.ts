
import * as vscode from "vscode";

let charDecoration: vscode.TextEditorDecorationType | undefined;
let charDecorationSecondColor: vscode.TextEditorDecorationType | undefined;

export const disposeCharDecoration = () => {
	charDecoration && charDecoration.dispose();
	charDecorationSecondColor && charDecorationSecondColor.dispose();
	charDecoration = undefined;
	charDecorationSecondColor = undefined;
}

export const getCharDecoration = (color: string) => {
	if (!charDecoration) {
		charDecoration = vscode.window.createTextEditorDecorationType({
			color,
		})
		return charDecoration;
	}
	return charDecoration;
}

export const getCharDecorationSecondColor = (color: string) => {
	if (!charDecorationSecondColor) {
		charDecorationSecondColor = vscode.window.createTextEditorDecorationType({
			color
		})
		return charDecorationSecondColor;
	}
	return charDecorationSecondColor;
}

export class DecorationConfig {
	public firstColor: string;
	public secondColor: string;
	constructor() {
		this.firstColor = "red";
		this.secondColor = "green";
	}
}

export const decorationConfig = new DecorationConfig();
import * as vscode from "vscode";
import { CharColoring } from "./CharHighlighter";
import {
  DecorationConfig,
  getCharDecoration,
  getCharDecorationSecondColor,
} from "./decoration";

export const getCurrentLine = () => {
  const activeEditor = getActiveEditor();
  const res = activeEditor?.document.lineAt(
    activeEditor?.selection.active.line
  );
  return res;
};

export const getActiveEditor = () => {
  return vscode.window.activeTextEditor;
};

export const getCursorPos = () => {
  return getActiveEditor()?.selection.active.character;
};

export const colorChars = (
  toColor: CharColoring[],
  decorationConfig: DecorationConfig
) => {
  const editor = getActiveEditor();
  if (!editor) {
    return;
  }
  const firstColorDecorations: vscode.DecorationOptions[] = [];
  const secondColorDecorations: vscode.DecorationOptions[] = [];
  const createPosition = (line: number, char: number) =>
    new vscode.Position(line, char);

  const line = getCurrentLine();
  for (const word of toColor) {
    if (line) {
      const startPos = createPosition(line.lineNumber, word.position);
      const endPos = createPosition(line.lineNumber, word.position + 1);
      const range = new vscode.Range(startPos, endPos);
      if (word.minTimesToReach > 1) {
        secondColorDecorations.push({ range });
      } else {
        firstColorDecorations.push({ range });
      }
    }
  }
  editor.setDecorations(
    getCharDecoration(decorationConfig.firstColor, decorationConfig.fontWeight),
    firstColorDecorations
  );
  editor.setDecorations(
    getCharDecorationSecondColor(
      decorationConfig.secondColor,
      decorationConfig.fontWeight
    ),
    secondColorDecorations
  );
};

import * as vscode from "vscode";
import { CharColoring } from "./charHighlighter";
import { DecorationConfig, getCharDecoration } from "./decoration";

export const getActiveEditor = () => vscode.window.activeTextEditor;

export const getCurrentLine = (
  editor: vscode.TextEditor | undefined = getActiveEditor()
) => editor?.document.lineAt(editor.selection.active.line);

export const getCursorPos = (
  editor: vscode.TextEditor | undefined = getActiveEditor()
) => editor?.selection.active.character;

export const colorChars = (
  editor: vscode.TextEditor,
  line: vscode.TextLine,
  toColor: CharColoring[],
  decorationConfig: DecorationConfig
) => {
  const primaryDecorations: vscode.DecorationOptions[] = [];
  const secondaryDecorations: vscode.DecorationOptions[] = [];

  for (const char of toColor) {
    const range = new vscode.Range(
      new vscode.Position(line.lineNumber, char.position),
      new vscode.Position(line.lineNumber, char.position + 1)
    );
    const decorations =
      char.minTimesToReach > 1 ? secondaryDecorations : primaryDecorations;
    decorations.push({ range });
  }

  editor.setDecorations(
    getCharDecoration(
      "primary",
      decorationConfig.firstColor,
      decorationConfig.fontWeight,
      decorationConfig.underline
    ),
    primaryDecorations
  );

  editor.setDecorations(
    getCharDecoration(
      "secondary",
      decorationConfig.secondColor,
      decorationConfig.fontWeight,
      decorationConfig.underline
    ),
    secondaryDecorations
  );
};

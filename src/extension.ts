import * as vscode from "vscode";
import { charHighlighter } from "./CharHighlighter";
import {
  decorationConfig,
  disposeCharDecoration,
  updateDecorationConfig,
} from "./decoration";
import { colorChars, getCurrentLine, getCursorPos } from "./utils";

export function activate(context: vscode.ExtensionContext) {

  // when the user types
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      const line = getCurrentLine();
      const cursorPos = getCursorPos();
      if (line?.text.length && cursorPos) {
        main(cursorPos, line.text)
      } else {
        disposeCharDecoration();
      }
    })
  );

  // when the cursor moves
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((e) => {
      const line = getCurrentLine();
      const cursorPos = e.textEditor.selection.active.character;
      if (line?.text.length) {
        main(cursorPos, line.text);
      } else {
        disposeCharDecoration();
      }
    })
  );

  // listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      const configChanged = e.affectsConfiguration('vimFindHighlight.charPrimaryColor') || e.affectsConfiguration('vimFindHighlight.charSecondaryColor') || e.affectsConfiguration('vimFindHighlight.charFontWeight') || e.affectsConfiguration('vimFindHighlight.enableUnderline');

      if (configChanged) {
        configureDecoration();
      }
    })
  )

  // when activating the extension. read the user settings file first
  configureDecoration();
}

const configureDecoration = () => {
  updateDecorationConfig();
  disposeCharDecoration();
};

const main = (cursorPos: number, currentLine: string) => {
  const toColor = charHighlighter.getCharHighlighting(currentLine, cursorPos);
  colorChars(toColor, decorationConfig);
};

// this method is called when your extension is deactivated
export function deactivate() { }

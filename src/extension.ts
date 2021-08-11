import * as vscode from "vscode";
import { charHighlighter } from "./CharHighlighter";
import { DEBOUNCE_TIMEOUT } from "./constants";
import {
  decorationConfig,
  disposeCharDecoration,
  updateDecorationConfig,
} from "./decoration";
import { colorChars, getCurrentLine, getCursorPos } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  let timeout: NodeJS.Timer | undefined = undefined;

  const debouncedMain = (cursorPos: number, text: string) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(() => main(cursorPos, text), DEBOUNCE_TIMEOUT);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "extension.refreshConfigFromSettings",
      (e) => {
        configureDecoration();
      }
    )
  );

  // when the user types
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      const line = getCurrentLine();
      const cursorPos = getCursorPos();
      if (line?.text.length && cursorPos) {
        debouncedMain(cursorPos, line.text);
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
        debouncedMain(cursorPos, line.text);
      } else {
        disposeCharDecoration();
      }
    })
  );

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
export function deactivate() {}

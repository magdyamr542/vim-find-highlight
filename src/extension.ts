import * as vscode from "vscode";
import { charHighlighter } from "./charHighlighter";
import { CONFIG_SECTION, getConfig, setEnableAutoHighlight } from "./config";
import {
  decorationConfig,
  disposeCharDecoration,
  updateDecorationConfig,
} from "./decoration";
import {
  colorChars,
  getActiveEditor,
  getCurrentLine,
  getCursorPos,
} from "./utils";

const TOGGLE_COMMAND = "vimFindHighlight.toggleAutoHighlight";
const HIGHLIGHT_COMMAND = "vimFindHighlight.highlightCharacters";

let autoHighlightEnabled = true;

export function activate(context: vscode.ExtensionContext) {
  updateDecorationConfig();
  autoHighlightEnabled = getConfig().enableAutoHighlight;

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => {
      if (autoHighlightEnabled) {
        refreshHighlighting();
      }
    }),
    vscode.window.onDidChangeTextEditorSelection(() => {
      if (autoHighlightEnabled) {
        refreshHighlighting();
      }
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(CONFIG_SECTION)) {
        updateDecorationConfig();
        disposeCharDecoration();
        autoHighlightEnabled = getConfig().enableAutoHighlight;
      }
    }),
    vscode.commands.registerCommand(TOGGLE_COMMAND, toggleAutoHighlight),
    vscode.commands.registerCommand(HIGHLIGHT_COMMAND, refreshHighlighting),
  );
}

export function deactivate() {}

function refreshHighlighting() {
  const editor = getActiveEditor();
  const line = getCurrentLine(editor);
  const cursorPos = getCursorPos(editor);

  if (!editor || !line?.text.length || cursorPos === undefined) {
    disposeCharDecoration();
    return;
  }

  const toColor = charHighlighter.getCharHighlighting(line.text, cursorPos);
  colorChars(editor, line, toColor, decorationConfig);
}

function toggleAutoHighlight() {
  const newValue = !getConfig().enableAutoHighlight;
  setEnableAutoHighlight(newValue).then(undefined, (reason) =>
    vscode.window.showInformationMessage(
      "Failed to toggle auto highlight: " + reason,
    ),
  );
  refreshHighlighting();
}

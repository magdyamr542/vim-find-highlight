import * as vscode from "vscode";
import { charHighlighter } from "./CharHighlighter";
import {
  decorationConfig,
  disposeCharDecoration,
  updateDecorationConfig,
} from "./decoration";
import { colorChars, getCurrentLine, getCursorPos } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  let autoHighlight = configureAutoHighlight();

  // when the user types
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      const line = getCurrentLine();
      const cursorPos = getCursorPos();
      if (line?.text.length && cursorPos != undefined && autoHighlight) {
        main(cursorPos, line.text);
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
      if (line?.text.length && autoHighlight) {
        main(cursorPos, line.text);
      } else {
        disposeCharDecoration();
      }
    })
  );

  // listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      const configChanged =
        e.affectsConfiguration("vimFindHighlight.charPrimaryColor") ||
        e.affectsConfiguration("vimFindHighlight.charSecondaryColor") ||
        e.affectsConfiguration("vimFindHighlight.charFontWeight") ||
        e.affectsConfiguration("vimFindHighlight.enableUnderline") ||
        e.affectsConfiguration("vimFindHighlight.enableAutoHighlight");

      if (configChanged) {
        configureDecoration();
        autoHighlight = configureAutoHighlight();
      }
    })
  );

  // when activating the extension. read the user settings file first and register the commands
  configureDecoration();
  registerCommands(context);
}

const configureDecoration = () => {
  updateDecorationConfig();
  disposeCharDecoration();
};

const configureAutoHighlight = (): boolean => {
  const settings = vscode.workspace.getConfiguration();
  const autoHighlight = settings.get(
    "vimFindHighlight.enableAutoHighlight"
  ) as boolean;
  return autoHighlight;
};

const main = (cursorPos: number, currentLine: string) => {
  const toColor = charHighlighter.getCharHighlighting(currentLine, cursorPos);
  colorChars(toColor, decorationConfig);
};

const registerCommands = (context: vscode.ExtensionContext) => {
  const toggleCommand = "vimFindHighlight.toggleAutoHighlight";
  context.subscriptions.push(
    vscode.commands.registerCommand(toggleCommand, toggleAutoHighlight)
  );

  const highlightCommand = "vimFindHighlight.highlightCharacters";
  context.subscriptions.push(
    vscode.commands.registerCommand(highlightCommand, highlightCharacters)
  );
};

const highlightCharacters = () => {
  const line = getCurrentLine();
  const cursorPos = getCursorPos();
  if (line?.text.length && cursorPos != undefined) {
    main(cursorPos, line.text);
  } else {
    disposeCharDecoration();
  }
};

// this method is called when your extension is deactivated
export function deactivate() { }

export function toggleAutoHighlight() {
  const settings = vscode.workspace.getConfiguration();
  const autoHighlight = settings.get(
    "vimFindHighlight.enableAutoHighlight"
  ) as boolean;
  settings
    .update(
      "vimFindHighlight.enableAutoHighlight",
      !autoHighlight,
      vscode.ConfigurationTarget.Global
    )
    .then(
      () => { },
      (reason) =>
        vscode.window.showInformationMessage(
          "Failed to toggle auto highlight: " + reason
        )
    );
  highlightCharacters();
}

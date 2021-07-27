import * as vscode from "vscode";

const getCurrentLine = () => {
  const document = vscode.window.activeTextEditor?.document;
  if (document) {
    return document.getText();
  }
};

const getCursorPos = () => {
  return vscode.window.activeTextEditor?.selection.active.character;
};

export function activate(context: vscode.ExtensionContext) {
  // register event when the user types something
  vscode.workspace.onDidChangeTextDocument((e) => {
    console.log("User changed text of document ");
    const text = getCurrentLine();
    const cursorPos = getCursorPos();
    let currentChar = "";
    if (text && cursorPos) {
      currentChar = text[cursorPos];
    }
    console.log({ text, cursorPos, currentChar });
  });

  vscode.window.onDidChangeTextEditorSelection((e) => {
    console.log("Changing selection");
    const text = getCurrentLine();
    const cursorPos = getCursorPos();
    let currentChar = "";
    if (text && cursorPos) {
      currentChar = text[cursorPos];
    }
    console.log({ text, cursorPos, currentChar });
    console.log("Event", e);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}

import * as vscode from "vscode";
import { getConfig } from "./config";

export type DecorationKind = "primary" | "secondary";

export class DecorationConfig {
  public firstColor = "red";
  public secondColor = "green";
  public fontWeight = "400";
  public underline = true;
}

export const decorationConfig = new DecorationConfig();

const decorationTypes = new Map<
  DecorationKind,
  vscode.TextEditorDecorationType
>();

export const disposeCharDecoration = () => {
  for (const decoration of decorationTypes.values()) {
    decoration.dispose();
  }
  decorationTypes.clear();
};

export const getCharDecoration = (
  kind: DecorationKind,
  color: string,
  fontWeight: string,
  underline: boolean,
): vscode.TextEditorDecorationType => {
  let decoration = decorationTypes.get(kind);
  if (!decoration) {
    decoration = vscode.window.createTextEditorDecorationType({
      color,
      fontWeight,
      textDecoration: underline ? "underline" : undefined,
    });
    decorationTypes.set(kind, decoration);
  }
  return decoration;
};

export const updateDecorationConfig = () => {
  const config = getConfig();
  decorationConfig.fontWeight = config.charFontWeight;
  decorationConfig.firstColor = config.charPrimaryColor;
  decorationConfig.secondColor = config.charSecondaryColor;
  decorationConfig.underline = config.enableUnderline;
};

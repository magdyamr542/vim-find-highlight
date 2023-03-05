import * as vscode from "vscode";
import {
  CHAR_FONTWEIGHT,
  CHAR_PRIMARY_COLOR,
  CHAR_SECONDARY_COLOR,
} from "./constants";

let charDecoration: vscode.TextEditorDecorationType | undefined;
let charDecorationSecondColor: vscode.TextEditorDecorationType | undefined;

export const disposeCharDecoration = () => {
  charDecoration && charDecoration.dispose();
  charDecorationSecondColor && charDecorationSecondColor.dispose();
  charDecoration = undefined;
  charDecorationSecondColor = undefined;
};

export const getCharDecoration = (
  color: string,
  fontWeight: string,
  underline: boolean
): vscode.TextEditorDecorationType => {
  if (!charDecoration) {
    charDecoration = vscode.window.createTextEditorDecorationType({
      color,
      fontWeight: fontWeight,
      textDecoration: underline === true ? "underline" : undefined,
    });
  }

  return charDecoration;
};

export const getCharDecorationSecondColor = (
  color: string,
  fontWeight: string,
  underline: boolean
) => {
  if (!charDecorationSecondColor) {
    charDecorationSecondColor = vscode.window.createTextEditorDecorationType({
      color,
      fontWeight,
      textDecoration: underline === true ? "underline" : undefined,
    });
  }
  return charDecorationSecondColor;
};

export class DecorationConfig {
  public firstColor: string;
  public secondColor: string;
  public fontWeight: string;
  public underline: boolean;
  constructor() {
    this.firstColor = CHAR_PRIMARY_COLOR;
    this.secondColor = CHAR_SECONDARY_COLOR;
    this.fontWeight = CHAR_FONTWEIGHT;
    this.underline = true;
  }
}

export const updateDecorationConfig = () => {
  const settings = vscode.workspace.getConfiguration();
  const fontWeight = settings.get("vimFindHighlight.charFontWeight");
  const primaryColor = settings.get("vimFindHighlight.charPrimaryColor");
  const secondaryColor = settings.get("vimFindHighlight.charSecondaryColor");
  const underline = settings.get("vimFindHighlight.enableUnderline");
  decorationConfig.firstColor = primaryColor as string;
  decorationConfig.secondColor = secondaryColor as string;
  decorationConfig.fontWeight = fontWeight as string;
  decorationConfig.underline = underline as boolean;
};

export const decorationConfig = new DecorationConfig();

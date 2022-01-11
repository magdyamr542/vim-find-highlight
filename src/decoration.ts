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

export const getCharDecoration = (color: string, fontWeight: string) => {
  if (!charDecoration) {
    charDecoration = vscode.window.createTextEditorDecorationType({
      color,
      fontWeight: fontWeight,
    });
    return charDecoration;
  }
  return charDecoration;
};

export const getCharDecorationSecondColor = (
  color: string,
  fontWeight: string
) => {
  if (!charDecorationSecondColor) {
    charDecorationSecondColor = vscode.window.createTextEditorDecorationType({
      color,
      fontWeight,
    });
    return charDecorationSecondColor;
  }
  return charDecorationSecondColor;
};

export class DecorationConfig {
  public firstColor: string;
  public secondColor: string;
  public fontWeight: string;
  constructor() {
    this.firstColor = CHAR_PRIMARY_COLOR;
    this.secondColor = CHAR_SECONDARY_COLOR;
    this.fontWeight = CHAR_FONTWEIGHT;
  }
}

export const updateDecorationConfig = () => {
  const settings = vscode.workspace.getConfiguration();
  const fontWeight = settings.get("vimFindHighlight.charFontWeight");
  const primaryColor = settings.get("vimFindHighlight.charPrimaryColor");
  const secondaryColor = settings.get("vimFindHighlight.charSecondaryColor");
  decorationConfig.firstColor = primaryColor as string;
  decorationConfig.secondColor = secondaryColor as string;
  decorationConfig.fontWeight = fontWeight as string;
};

export const decorationConfig = new DecorationConfig();

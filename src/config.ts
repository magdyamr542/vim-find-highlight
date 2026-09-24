import * as vscode from "vscode";

export const CONFIG_SECTION = "vimFindHighlight";

export interface VimFindHighlightConfig {
  charPrimaryColor: string;
  charSecondaryColor: string;
  charFontWeight: string;
  enableUnderline: boolean;
  enableAutoHighlight: boolean;
}

const DEFAULTS: VimFindHighlightConfig = {
  charPrimaryColor: "red",
  charSecondaryColor: "green",
  charFontWeight: "400",
  enableUnderline: true,
  enableAutoHighlight: true,
};

export const getConfig = (): VimFindHighlightConfig => {
  const settings = vscode.workspace.getConfiguration(CONFIG_SECTION);
  return {
    charPrimaryColor: settings.get(
      "charPrimaryColor",
      DEFAULTS.charPrimaryColor
    ),
    charSecondaryColor: settings.get(
      "charSecondaryColor",
      DEFAULTS.charSecondaryColor
    ),
    charFontWeight: settings.get("charFontWeight", DEFAULTS.charFontWeight),
    enableUnderline: settings.get(
      "enableUnderline",
      DEFAULTS.enableUnderline
    ),
    enableAutoHighlight: settings.get(
      "enableAutoHighlight",
      DEFAULTS.enableAutoHighlight
    ),
  };
};

export const setEnableAutoHighlight = (value: boolean): Thenable<void> =>
  vscode.workspace
    .getConfiguration(CONFIG_SECTION)
    .update(
      "enableAutoHighlight",
      value,
      vscode.ConfigurationTarget.Global
    );

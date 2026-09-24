# Vim Find Highlight

[![CI](https://github.com/magdyamr542/vim-find-highlight/actions/workflows/ci.yml/badge.svg)](https://github.com/magdyamr542/vim-find-highlight/actions/workflows/ci.yml)

- this extension is inspired by [vim quick scope](https://github.com/unblevable/quick-scope)

![showcase](./showcase.gif)

## Install

- From within VS Code: open the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`), search for `Vim Find Highlight`, and install.
- Or via the command line: `code --install-extension AmrMetwally.vim-find-highlight`
- Or from the [marketplace page](https://marketplace.visualstudio.com/items?itemName=AmrMetwally.vim-find-highlight).

## What does it do?

- For people who use **vim** with vscode. the **find** command is pretty useful to go quickly to a specific word by typing `f [some character in the word]` in normal mode.

- this becomes a problem when there are multiple words in the line that contain the same characters that you use with the find command.

  - `<cursorPos> const name = "tsr"` Note that you can only reach the string `"tsr"` with one jump by using the command `f r`.

- The main goal of the extension is to **highlight** a character in every word such that when using this character with the **find** command, you reach the word with as minimal jumps as possible.

- This isn't always possible if the line contains repeated words. the extension can be configured to color the character with another color to indicate that the word cannot be reached with only one jump
  - Example of such case: `<cursorPos> test test`
  - In this case the extension would highlight the character that enables you to go to the second `test` as quickly as possible. Here the character `e` will be highlighted (you need 2 jumps) instead of `t` (you need 3 jumps).

## Configuration

- The configuration is simple
- Go to `settings.json` and set the following (values shown below are the defaults)

  1. ` "vimFindHighlight.charPrimaryColor": "red" // the color that will be used if the word can be reached with one jump`

  2. ` "vimFindHighlight.charSecondaryColor": "green" // the color that will be used if the word can not be reached with one jump`

  3. ` "vimFindHighlight.charFontWeight": "600" // font weight of the highlighted character`

  4. ` "vimFindHighlight.enableUnderline": true // underline the highlighted characters`

  5. `"vimFindHighlight.enableAutoHighlight": true // highlight characters automatically`


## Commands

This extension exposes two commands (accessible through the command palette):

- `Vim Find Highlight: Toggle Auto Highlight`: Enables or disables the autohighlight setting described above.
  - When remapping a shortcut to the command, use `vimFindHighlight.toggleAutoHighlight`
- `Vim Find Highlight: Highlight Characters`: Force a highlight of jumpable characters. Useful when paired with `vimFindHighlight.enableAutoHighlight: false`.
  - When remapping a shortcut to the command, use `vimFindHighlight.highlightCharacters`

You can remap the `Highlight Characters` command either using VSCode native keyword shortcuts, or [vscode vim](https://github.com/VSCodeVim/Vim) KeyBindings.

## Releasing

Releases are published to the Marketplace automatically by the [`publish` workflow](./.github/workflows/publish.yml) when a `vX.Y.Z` tag is pushed:

1. Bump `"version"` in `package.json` and commit it.
2. Tag that commit and push the tag, e.g. for `0.0.11`:
   ```sh
   git tag v0.0.11
   git push origin v0.0.11
   ```
3. The workflow checks that the tag matches `package.json`'s version, runs lint/tests, then runs `vsce publish`.

Requires a `VSCE_PAT` repository secret (a Marketplace [Personal Access Token](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token)).

## Links

- [github link](https://github.com/magdyamr542/vim-find-highlight)
- [vscode market place link](https://marketplace.visualstudio.com/items?itemName=AmrMetwally.vim-find-highlight)

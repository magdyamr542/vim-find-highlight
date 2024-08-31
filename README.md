# Vim Find Highlight

- this extension is inspired by [vim quick scope](https://github.com/unblevable/quick-scope)

![showcase](./showcase.gif)

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
- Go to `settings.json` and set the following

  1. ` "vimFindHighlight.charPrimaryColor": "green" // the color that will be used if the word can be reached with one jump`

  2. ` "vimFindHighlight.charSecondaryColor": "red" // the color that will be used if the word can not be reached with one jump`

  3. ` "vimFindHighlight.charFontWeight": "600" // font weight of the highlighted character`

  4. ` "vimFindHighlight.enableUnderline": true // underline the highlighted characters`

  5. `"vimFindHighlight.enableAutoHighlight": true // highlight characters automatically`
  

## Commands

This extension exposes two commands (accessible through the command palette):

- `Toggle Auto Highlight`: Enables or disables the autohighlight setting described above.
- `Highlight Characters`: Force a highlight of jumpable characters. Useful when paired with `vimFindHighlight.enableAutoHighlight: false`.

You can remap the `Highlight Characters` command either using VSCode native keyword shortcuts, or [vscode vim](https://github.com/VSCodeVim/Vim) KeyBindings.

## Links

- [github link](https://github.com/magdyamr542/vim-find-highlight)
- [vscode market place link](https://marketplace.visualstudio.com/items?itemName=AmrMetwally.vim-find-highlight)

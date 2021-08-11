# Command Menu

A command menu, palette for the web. Similar to ctrl+k or ctrl+p in code editors.

## Features

- accessible UI with [alphagov/accessible-autocomplete](https://github.com/alphagov/accessible-autocomplete)
- fuzzy search using [farzher/fuzzysort](https://github.com/farzher/fuzzysort)
- optional modal UI with keybindings
- can call arbitrary commands and functions
- is a web component/custom element

## How to use

Since it's not on npm yet you'll have to copy the files for now. Also see index.html for a complete example.

1. Include the script
2. Include the styles
3. Add `<command-menu>` element to your page
4. Pass it your commands like so:

```js
const commands = [
  {keys: '', label: 'Help', command: () => { confirm('Send help please') }},
  {keys: 'p', label: 'Play track'},
  {keys: 'n', label: 'Stop track'}
]
document.querySelector('command-menu').list = commands
```

> Note: we don't handle keybindindings for the commands. You'll have to do that yourself. For now.

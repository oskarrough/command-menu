# Command Menu

A command menu, palette for the web. Similar to ctrl+k or ctrl+p in code editors.

## Features

- is a web component
- accessible UI (hopefully)
- fuzzy search using [farzher/fuzzysort](https://github.com/farzher/fuzzysort)
- optional modal UI with keybindings
- can call arbitrary commands and functions
- attempted to make focus navigation feel natural

## How to use

Since it's not on npm yet you'll have to copy the files for now. Also see index.html for a complete example.

1. Include the script
2. Include the styles
3. Add `<command-menu>` element to your page
4. Pass it your commands like so:

```js
/**
 * @typedef {Object} Command
 * @property {String} title - The title of the command
 * @property {String} [subtitle] - A description of the command
 * @property {String} [shortcut] - A keyboard shortcut, e.g. "Ctrl+K"
 * @property {Function} [action] - The function to call when the command is selected
 * @property {Array<Command>} [children] - A list of child commands
 */
const commands = [
  {title: 'Play track', shortcut: 'p', },
  {title: 'Stop track', shortcut: 'n'},
  {title: 'Help', action: () => { confirm('Send help please') }},
	{title: 'Typography', children: [{title: 'Bold'}, {title: 'Italic'}]}
]
document.querySelector('command-menu').list = commands
```

## References

- https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
- https://www.w3.org/WAI/tutorials/menus/application-menus/#keyboard-behavior
- https://github.com/Heydon/inclusive-menu-button/blob/master/inclusive-menu-button.js
- https://headlessui.com/react/combobox#combobox
- https://developers.raycast.com/basics/prepare-an-extension-for-store#ui-ux-guidelines
- https://github.com/pacocoursey/cmdk

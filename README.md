# Command Menu

A command menu, palette for the web. Similar to ctrl+k or ctrl+p in code editors.

## Features

- is a web component
- accessible UI (hopefully)
- fuzzy search using [farzher/fuzzysort](https://github.com/farzher/fuzzysort)
- optional modal UI with keybindings
- can call arbitrary commands and functions

## How to use

Since it's not on npm yet you'll have to copy the files for now. Also see index.html for a complete example.

1. Include the script
2. Include the styles
3. Add `<command-menu>` element to your page
4. Pass it your commands like so:

```js
const commands = [
  {title: 'Help', action: () => { confirm('Send help please') }},
  {title: 'Play track', keys: 'p', },
  {title: 'Stop track', keys: 'n'}
]
document.querySelector('command-menu').list = commands
```

> Note: we don't handle keybindindings for the commands. You'll have to do that yourself. For now.

## References

- https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
- https://www.w3.org/WAI/tutorials/menus/application-menus/#keyboard-behavior
- https://github.com/Heydon/inclusive-menu-button/blob/master/inclusive-menu-button.js
- https://headlessui.com/react/combobox#combobox
- https://developers.raycast.com/basics/prepare-an-extension-for-store#ui-ux-guidelines
- https://github.com/pacocoursey/cmdk

// yarn add accessible-autocomplete fuzzysort
const {accessibleAutocomplete, fuzzysort} = window

const commands = [
  {keys: '', label: 'Help', command: () => { console.log('send help plx') }},
  {keys: 'p', label: 'Play/pause the session'},
  {keys: 'n', label: 'Play next track in current radio'},
  {keys: 's', label: 'Shuffle current track selection'},
  {keys: 'm', label: '(un)mute the volume'},
  {keys: 'r', label: 'Play a random radio channel'},
  {keys: 'f', label: 'Cycle through formats (default, fullscreen, minimized)'},
  {keys: 'g h', label: 'Go to home'},
  {keys: 'g r', label: 'Go to all radios'},
  {keys: 'g m', label: 'Go to map'},
  {keys: 'g y', label: 'Go to history (y, as in your web-browser)'},
  {keys: 'g i', label: 'Go to my radio (i, as in I, me)'},
  {keys: 'g s', label: 'Go to my favorite radios (s, as in starred)'},
  {keys: 'g t', label: 'Go to my tracks'},
  {keys: 'g a', label: 'Go to add'},
  {keys: 'g f', label: 'Go to feedback'},
  {keys: 'g c', label: 'Go to current radio (the one being played)'},
  {keys: 'g x', label: 'Go to the track being played (x, as in a cross to locate the track/trax)'}
]

// <label for="my-autocomplete">Choose an action</label>
// <div id="my-autocomplete-container"></div>

function suggest(query, populateResults) {
  let results = window.fuzzysort.go(query, commands, {key: 'label'})
  results = results.total ? results.map(r => r.obj) : commands
  populateResults(results)
}

class Autocomplete extends HTMLElement {
  connectedCallback() {
    this.enableAutocomplete()
  }
  enableAutocomplete() {
    window.accessibleAutocomplete({
      element: this,
      id: 'my-autocomplete', // To match it to the existing <label>.
      source: suggest,
      placeholder: 'Search for a command',
      autoselect: true,
      confirmOnBlur: true, // should be true for touch at least
      showAllValues: true,
      // displayMenu: 'overlay',
      templates: {
        inputValue: (val) => {
          if (val && val.label) return val.label
          return val
        },
        suggestion: (s) => {
          if (!s) return s
          return `${s.label} <kbd>${s.keys}</kbd>`
        }
      },
      onConfirm: (confirmed) => {
        console.log({confirmed})
        if (confirmed) {
          let el = document.querySelector('#my-autocomplete-confirmed')
          el.textContent = confirmed.label
        }
        if (confirmed && confirmed.command) confirmed.command()
      },
      dropdownArrow: ({ className }) => `<svg class="${className}" style="top: 8px;" viewBox="0 0 512 512" ><path d="M256,298.3L256,298.3L256,298.3l174.2-167.2c4.3-4.2,11.4-4.1,15.8,0.2l30.6,29.9c4.4,4.3,4.5,11.3,0.2,15.5L264.1,380.9  c-2.2,2.2-5.2,3.2-8.1,3c-3,0.1-5.9-0.9-8.1-3L35.2,176.7c-4.3-4.2-4.2-11.2,0.2-15.5L66,131.3c4.4-4.3,11.5-4.4,15.8-0.2L256,298.3  z"/></svg>`
    })
  }
}

customElements.define('auto-complete', Autocomplete)
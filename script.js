// yarn add accessible-autocomplete fuzzysort

// window.accessibleAutocomplete.enhanceSelectElement({
//   selectElement: document.querySelector('#commands')
// })

const commands = [
  {keys: '', label: 'Help', command: () => { alert('send help plx') }},
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
  const searchResults = window.fuzzysort.go(query, commands, {key: 'label'})
  if (searchResults.total) {
    // Transform data back from fuzzysort
    populateResults(searchResults.map(r => r.obj))
  } else {
    populateResults(commands)
  }
}

window.accessibleAutocomplete({
  id: 'my-autocomplete', // To match it to the existing <label>.
  element: document.querySelector('#my-autocomplete-container'),
  source: suggest,
  
  autoselect: true,
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
  }
})
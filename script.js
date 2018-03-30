// yarn add accessible-autocomplete fuzzysort

const commands = [
  {keys: 'p', label: 'play/pause the session'},
  {keys: 'n', label: 'play next track in current radio'},
  {keys: 's', label: 'shuffle current track selection'},
  {keys: 'm', label: '(un)mute the volume'},
  {keys: 'r', label: 'play a random radio channel'},
  {keys: 'f', label: 'cycle through formats (default, fullscreen, minimized)'},
  {keys: 'g h', label: 'go to home'},
  {keys: 'g r', label: 'go to all radios'},
  {keys: 'g m', label: 'go to map'},
  {keys: 'g y', label: 'go to history (y, as in your web-browser)'},
  {keys: 'g i', label: 'go to my radio (i, as in I, me)'},
  {keys: 'g s', label: 'go to my favorite radios (s, as in starred)'},
  {keys: 'g t', label: 'go to my tracks'},
  {keys: 'g a', label: 'go to add'},
  {keys: 'g f', label: 'go to feedback'},
  {keys: 'g c', label: 'go to current radio (the one being played)'},
  {keys: 'g x', label: 'go to the track being played (x, as in a cross to locate the track/trax)'}
]

function suggest(query, populateResults) {
  let suggestions = commands
  
  const searchResults = window.fuzzysort.go(query, commands, {key: 'label'})
  if (searchResults.total > 0) {
    suggestions = searchResults.map(r => r.obj)
  }
  
  console.log({suggestions})
  populateResults(suggestions)
}

function inputValueTemplate(value) {
  // console.log({value})
  if (value) return value.label
  return value
}

function suggestionTemplate (suggestion) {
  return `${suggestion.label} <kbd>${suggestion.keys}</kbd>`
}

window.accessibleAutocomplete({
  element: document.querySelector('#my-autocomplete-container'),
  id: 'my-autocomplete', // To match it to the existing <label>.
  source: suggest,
  showAllValues: true,
  templates: {
    inputValue: inputValueTemplate,
    suggestion: suggestionTemplate
  },
  onConfirm: function(confirmed) {
    console.log({confirmed})
    let el = document.querySelector('#my-autocomplete-confirmed')
    el.textContent = `You chose ${suggestionTemplate(confirmed)}`
  }
})
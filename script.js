// yarn add accessible-autocomplete fuzzysort

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

fuzzyAutocomplete(commands)

function fuzzyAutocomplete(commands) {
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
    autoselect: true,
    showAllValues: true,
    // displayMenu: 'overlay',
    templates: {
      inputValue: inputValueTemplate,
      suggestion: suggestionTemplate
    },
    onConfirm: function(confirmed) {
      console.log({confirmed})
      let el = document.querySelector('#my-autocomplete-confirmed')
      el.textContent = suggestionTemplate(confirmed)
      if (confirmed.command) confirmed.command()
    }
  })

}
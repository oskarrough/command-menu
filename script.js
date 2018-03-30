// import accessibleAutocomplete from 'accessible-autocomplete'

// window.accessibleAutocomplete.enhanceSelectElement({
//   selectElement: document.querySelector('#location-picker')
// })

const commands = [
	{
		label: "open something",
		shortcut: 'Shift+O'
	},
	{
		label: "new tab",
		shortcut: 'CMD+N'
	},
	{
		label: "new window",
    shortcut: 'CMD+Shift+O'
	}
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
  return `<b>${suggestion.label}</b> <kbd>${suggestion.shortcut}</kbd>`
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
  }
})
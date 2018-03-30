// import accessibleAutocomplete from 'accessible-autocomplete'

window.accessibleAutocomplete.enhanceSelectElement({
  selectElement: document.querySelector('#location-picker')
})

// const defaultCommands = [
//   'France',
//   'Germany',
//   'United Kingdom'
// ]

const defaultCommands = [
	{
		label: "Open something",
		shortcut: 'Shift+O'
	},
	{
		label: "New Tab",
		shortcut: 'CMD+N'
	},
	{
		label: "New Window",
    shortcut: 'CMD+Shift+O'
	}
]


function suggest (query, populateResults) {
  const filteredResults = defaultCommands.filter(result => {
    // console.log('suggest', {result, query})
    return result.label.indexOf(query) !== -1
  })
  // console.log({filteredResults})
  populateResults(filteredResults)
}

function suggestionTemplate (suggestion) {
  return `<b>${suggestion.label}</b> <kbd>${suggestion.shortcut}</kbd>`
}

window.accessibleAutocomplete({
  element: document.querySelector('#my-autocomplete-container'),
  id: 'my-autocomplete', // To match it to the existing <label>.
  // source: defaultCommands
  source: suggest,
  showAllValues: true,
  templates: {
    inputValue: function(val) {
      console.log({val})
      if (val) return val.label
    },
    suggestion: suggestionTemplate
  },
  onConfirm: function(confirmed) {
    console.log({confirmed})
  }
})
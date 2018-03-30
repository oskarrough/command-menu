// import accessibleAutocomplete from 'accessible-autocomplete'

// window.accessibleAutocomplete.enhanceSelectElement({
//   selectElement: document.querySelector('#location-picker')
// })

const countries = [
  'France',
  'Germany',
  'United Kingdom'
]

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
  const results = window.fuzzysort.go(query, commands)
  console.log(results)
  // const filteredResults = commands.filter(result => {
  //   return result.label.indexOf(query) !== -1
  // })
  // const labels = filteredResults.map(result => result.label)
  // console.log({filteredResults})
  // populateResults(filteredResults)
  populateResults(commands)
}

function inputValueTemplate(value) {
  console.log({value})
  return "test"
}

function suggestionTemplate (suggestion) {
  return `<b>${suggestion.label}</b> <kbd>${suggestion.shortcut}</kbd>`
}

window.accessibleAutocomplete({
  element: document.querySelector('#my-autocomplete-container'),
  id: 'my-autocomplete', // To match it to the existing <label>.
  // source: countries,
  source: suggest,
  showAllValues: true,
  templates: {
    // inputValue: inputValueTemplate,
    suggestion: suggestionTemplate
  },
  onConfirm: function(confirmed) {
    console.log({confirmed})
  }
})
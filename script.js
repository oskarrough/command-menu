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

const x = commands.map(c => c.label)

function suggest(query, populateResults) {
  const results = window.fuzzysort.go(query, commands, {key: 'label'})
  console.log(results)
  // const filteredResults = commands.filter(result => {
  //   return result.label.indexOf(query) !== -1
  // })
  // const labels = filteredResults.map(result => result.label)
  // console.log({filteredResults})
  // populateResults(filteredResults)
  // const filtered = commands.filter(c => c.label
  populateResults(results)
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
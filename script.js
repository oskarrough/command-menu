// import accessibleAutocomplete from 'accessible-autocomplete'

window.accessibleAutocomplete.enhanceSelectElement({
  selectElement: document.querySelector('#location-picker')
})

const defaultCommands = [
  'France',
  'Germany',
  'United Kingdom'
]

function suggest (query, populateResults) {
  const filteredResults = defaultCommands.filter(result => result.indexOf(query) !== -1)
  console.log(filteredResults)
  populateResults(filteredResults)
}

window.accessibleAutocomplete({
  element: document.querySelector('#my-autocomplete-container'),
  id: 'my-autocomplete', // To match it to the existing <label>.
  // source: defaultCommands
  source: suggest,
  showAllValues: true
})
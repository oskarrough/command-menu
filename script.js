// yarn add accessible-autocomplete fuzzysort
const {accessibleAutocomplete, fuzzysort} = window

// <label for="my-autocomplete">Choose an action</label>
// <div id="my-autocomplete-container"></div>

// const exampleCommands = [
//   {keys: 'h', label: 'Help', command: () => { confirm('send help please') }},
//   {keys: 'p', label: 'Play/pause the session'},
//   {keys: 'n', label: 'Play next track in current radio'}
// ]

class Autocomplete extends HTMLElement {
  connectedCallback() {
    this.enable()
    if (this.hasAttribute('modal')) {
      document.addEventListener('keydown', this.handleShortcut.bind(this))
      document.addEventListener('click', this.handleClick.bind(this))
    }
  }
  handleShortcut(event) {
    if ((event.ctrlKey || event.metaKey) && event.key == "k") {
      event.preventDefault()
      this.classList.toggle('is-open')
      this.querySelector('.autocomplete__input').focus()
    }
    if (event.key === 'Escape' && this.hasAttribute('modal')) this.classList.remove('is-open')
  }
  handleClick(event) {
    if (event.target === this) {
      this.classList.remove('is-open')
    }
  }
  enable() {
    const list = this.list
    if (!list) throw new Error('Could not start. Missing a list of commands')
    
    function suggest(query, populateResults) {
      let results = fuzzysort.go(query, list, {key: 'label'})
      results = results.total ? results.map(r => r.obj) : list
      populateResults(results)
    }
    
    accessibleAutocomplete({
      element: this,
      id: 'my-autocomplete', // To match it to the existing <label>?.
      source: suggest,
      placeholder: 'Type a command or search',
      autoselect: true,
      confirmOnBlur: false, // should be true for touch at least?
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
        this.classList.remove('is-open')
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
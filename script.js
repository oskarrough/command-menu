import accessibleAutocomplete from 'https://cdn.skypack.dev/accessible-autocomplete'
import fuzzysort from 'https://cdn.skypack.dev/fuzzysort';

class CommandMenu extends HTMLElement {
  connectedCallback() {
    this.enable()

    // If modal is activated, add keybindings to toggle it.
    if (this.hasAttribute('modal')) {
      document.addEventListener('keydown', this.handleShortcut.bind(this))
    }
  }
  
  enable() {
    const list = this.list
    if (!list) throw new Error('Could not enable command menu. Set the `list` property on the element a list of commands')
    
    accessibleAutocomplete({
      element: this,
      id: 'my-autocomplete', // not sure why this is needed
      placeholder: 'Type a command or search',
      autoselect: true,
      confirmOnBlur: false, // should be true for touch at least?
      showAllValues: true,
      // Used to search the command list.
      source(query, populateResults) {
        let results = fuzzysort.go(query, list, {key: 'label'})
        results = results.total ? results.map(r => r.obj) : list
        populateResults(results)
      },
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
        this.close()
        console.log({confirmed})
        
        // For debugging
        if (confirmed) {
          let el = document.querySelector('#my-autocomplete-confirmed')
          el.textContent = confirmed.label
        }

        if (confirmed && confirmed.command) confirmed.command()
      },
      dropdownArrow: ({ className }) => `<svg class="${className}" style="top: 8px;" viewBox="0 0 512 512" ><path d="M256,298.3L256,298.3L256,298.3l174.2-167.2c4.3-4.2,11.4-4.1,15.8,0.2l30.6,29.9c4.4,4.3,4.5,11.3,0.2,15.5L264.1,380.9  c-2.2,2.2-5.2,3.2-8.1,3c-3,0.1-5.9-0.9-8.1-3L35.2,176.7c-4.3-4.2-4.2-11.2,0.2-15.5L66,131.3c4.4-4.3,11.5-4.4,15.8-0.2L256,298.3  z"/></svg>`
    })
  }

  // Ctrl+k or Command+k toggles it. Escape closes it, if open.
  handleShortcut(event) {
    if ((event.ctrlKey || event.metaKey) && event.key == "k") {
      event.preventDefault()
      this.toggle()
    }
    if (event.key === 'Escape' && this.hasAttribute('modal')) this.close()
  }

  handleClick(event) {
    if (event.target === this) {
      this.close()
    }
  }

  open() {
    this.classList.add('is-open')
    this.querySelector('.autocomplete__input').focus()
    document.addEventListener('click', this.handleClick.bind(this))
  }

  close() {
    this.classList.remove('is-open')
    document.removeEventListener('click', this.handleClick.bind(this))
  }

  toggle() {
    this.classList.contains('is-open') ? this.close() : this.open()
  } 
}

customElements.define('command-menu', CommandMenu)

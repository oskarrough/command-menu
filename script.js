// import {LitElement, html, render} from 'https://cdn.jsdelivr.net/npm/lit-html@2.7.4/+esm'
import { LitElement, html, css, render } from 'https://cdn.jsdelivr.net/npm/lit/+esm'
// import accessibleAutocomplete from 'https://cdn.skypack.dev/accessible-autocomplete'
// import fuzzysort from 'https://cdn.skypack.dev/fuzzysort';

class CommandMenuItem extends LitElement {
  static get properties() {
    return {
      item: { type: 'Object' },
      // title: { type: 'String' },
      // subtitle: { type: 'String' },
      // shortcut: { type: 'String' },
      // children: { type: 'Array' },
    }
  }

  static styles = css`
    command-menu-item-title {
      font-weight: bold;
    }
  `

  render() {
    const { title, subtitle, shortcut, children } = this.item
    return html`
      <command-menu-item-title>${title}</command-menu-item-title>
      <command-menu-item-subtitle>${subtitle}</command-menu-item-subtitle>
      ${shortcut ? html`<kbd>${shortcut}</kbd>` : null}
      <slot></slot>
    `
  }
}

class CommandMenu extends LitElement {
  static get properties() {
    return {
      modal: { type: 'Boolean', reflect: true },
      list: { type: 'Array', state: true },
    }
  }

  static styles = css`
    command-menu-list {
      display: flex;
      flex-flow: column;
    }
    command-menu-list command-menu-list {
      margin-top: 0.5em;
      margin-left: 1em;
    }
    
    command-menu-item:focus {
      outline: 5px solid green;
    }
    command-menu-item:hover command-menu-item-title {
      outline: 5px solid blue;
    }
    [hidden] {
      display: none;
    }
  `

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('keydown', this.onKeyboardPress.bind(this))
    // this.enable()
    // If modal is activated, add keybindings to toggle it.
    // if (this.hasAttribute('modal')) {
    //   document.addEventListener('keydown', this.handleShortcut.bind(this))
    // }
  }

  render() {
    if (!this.list) return null
    console.log(this.list)
    return html`
      <p><label><input type="search" placeholder="Search for commands"></label></p>
      
      <command-menu-list role="menu">
        ${this.list.map(item => html`
          <command-menu-item role="menuitem" .item=${item} tabindex="0">
            ${item.children?.length ? html`
              <command-menu-list hidden role="menu" >
                ${item.children.map(item => html`
                  <command-menu-item role="menuitem" .item=${item} tabindex="0">
                  </command-menu-item>
                `)}
              </command-menu-list>
              ` : null}
          </command-menu-item>
        `)}
      </command-menu-list>
    `
  }


  showChildren(event) {
    const button = event.target
    const expanded = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', !expanded)

    const list = event.target.nextElementSibling
    list.hidden = !list.hidden
  }

  filterList() {
    let results = fuzzysort.go(query, list, { key: 'label' })
    results = results.total ? results.map(r => r.obj) : list
    populateResults(results)
  }

  onConfirm(confirmed) {
    this.close()
    console.log({ confirmed })

    // For debugging
    if (confirmed) {
      let el = document.querySelector('#my-autocomplete-confirmed')
      el.textContent = confirmed.label
    }

    if (confirmed && confirmed.command) confirmed.command()
  }

  // Ctrl+k or Command+k toggles it. Escape closes it, if open.
  onKeyboardPress(event) {
    console.log(event.key)
    if ((event.ctrlKey || event.metaKey) && event.key == "k") {
      event.preventDefault()
      this.toggle()
    }
    if (event.key === 'Escape' && this.hasAttribute('modal')) this.close()

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.focusNext()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.focusPrevious()
    } else if (event.key === 'Enter') {
      this.enter(event)
    }
  }

  focusPrevious() {
    const focused = this.shadowRoot.activeElement
    let previous = focused.previousElementSibling
    console.log('focusPrevious', focused, previous)
    if (previous) previous.focus()
  }

  focusNext() {
    const focused = this.shadowRoot.activeElement
    let next = focused.nextElementSibling
    console.log('focusNext', focused, next)
    if (!next) {
      next = focused.querySelector('command-menu-item')
      console.log('focusNext again', focused, next)
    }
    if (next) next.focus()
  }

  enter() {
    const focused = this.shadowRoot.activeElement
    console.log('enter', focused.shadowRoot.querySelector('command-menu-item-title').textContent)
    // debugger 
    const list = focused.shadowRoot.querySelector('slot').assignedElements()[0]
    // const list = focused.shadowRoot.querySelector('command-menu-list')
    list.hidden = !list.hidden
  }

  onClick(event) {
    if (event.target === this) {
      this.close()
    }
  }

  open() {
    this.classList.add('is-open')
    this.querySelector('.autocomplete__input').focus()
    document.addEventListener('click', this.onClick.bind(this))
  }

  close() {
    this.classList.remove('is-open')
    document.removeEventListener('click', this.onClick.bind(this))
  }

  toggle() {
    this.classList.contains('is-open') ? this.close() : this.open()
  }
}

customElements.define('command-menu', CommandMenu)
customElements.define('command-menu-item', CommandMenuItem)

// List
// 	name
// 	icon
// 	commands
// 	Command[] 

// ListItem
// 	(key, icon, title, subtitle)

// Command
// 	name
// 	title
// 	subtitle
// 	description
// 	mode
// 	actions (default action <enter>)

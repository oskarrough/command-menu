import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit/+esm'
import fuzzysort from 'https://cdn.skypack.dev/fuzzysort'

/**
 * @typedef {Object} Command
 * @property {String} title - The title of the command
 * @property {String} [subtitle] - A description of the command
 * @property {String} [shortcut] - A keyboard shortcut, e.g. "Ctrl+K"
 * @property {Function} [action] - The function to call when the command is selected
 * @property {Array<Command>} [children] - A list of child commands
 */

class CommandMenu extends LitElement {
  static get properties() {
    return {
      modal: { type: 'Boolean', reflect: true },
      list: { type: 'Array' },
      commands: { type: 'Array', state: true },
      search: { type: 'String' },
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-flow: column nowrap;
      /* gap: 0.5em; */
      border: 2px solid yellowgreen;
      background: hsl(0deg 23% 95%);
      border-radius: 0.5em;
      box-shadow: rgba(0, 0, 0, 0.5) 0px 1em 4em;
    }
    command-menu-input {
      position: sticky;
      top: 0;
    }
    input[type=search] {
      width: 100%;
      padding: 1em;
      font-family: inherit;
      font-size: 1em;
      border: 0;
      border-bottom: 1px solid hsla(0deg 0% 0% / 20%);
      background: none;
    }
    input[type=search]:focus {
      outline: none;
    }
    command-menu-list {
      display: flex;
      flex-flow: column;
      margin: 0.5em;
    }
    command-menu-list {
      width: 100%;
    }
    command-menu-item {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      gap: 0.4em;
      padding: 0.75em 0.6em;
      user-select: none;
    }
    command-menu-item:focus,
    command-menu-input:has(:focus-within) + command-menu-list > command-menu-item:first-child {
      outline: 2px solid;
      outline: 0;
      background: hsla(0deg 0% 80% / 70%);
      border-radius: 0.5em;
    }
    command-menu-item-subtitle {
      opacity: 0.5;
    }
     command-menu-item kbd {
      display: inline-block;
      font-size: 0.875rem;
      padding: 0 0.4em 0.1em;
      line-height: initial;
      background-color: #fafbfc;
      border: solid 1px #d1d5da;
      border-bottom-color: #c6cbd1;
      border-radius: 3px;
      box-shadow: inset 0 -1px 0 #c6cbd1;
      margin-bottom: auto;
      flex-shrink: 0;
    }
    [hidden] {
      display: none;
    }
  `

  connectedCallback() {
    super.connectedCallback()
    
    if (this.hasAttribute('modal')) {
      this.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key == "k") {
          event.preventDefault()
          this.toggle()
        }
        if (event.key === 'Escape') {
          event.preventDefault()
          this.close()
        }
      })
    }
  }

  render() {
    // if (!this.list) return null
    return html`
      <command-menu-input>
        <label>
          <input
            type="search"
            placeholder="Search for commands"
            @input=${(e) => this.search = e.target.value}
            @keydown=${this.onKeyboardSearch} />
        </label>
      </command-menu-input>
      <command-menu-list role="menu" @keydown=${this.onKeyboardPress}>
        ${this.commands.map(item => html`
          <command-menu-item role="menuitem" .item=${item}></command-menu-item>
        `)}
      </command-menu-list>
    `
  }

  get commands() {
    if (this.search) {
      const results = fuzzysort.go(this.search, this.list, { keys: ['title'] })
      return results.map(result => result.obj)
    }
    return this.list

  }

  onKeyboardSearch(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.moveNext()
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      // Select first item from results
      this.selectCommand(this.commands[0])
    }
  }

  // Ctrl+k or Command+k toggles it. Escape closes it, if open.
  onKeyboardPress(event) {
    console.log('keydown', event.key)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.moveNext()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.movePrevious()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      this.moveIn()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      this.moveOut()
    } else if (event.key === 'Enter') {
      event.preventDefault()
      this.selectCommand()
    }
  }

  move(element) {
    element?.focus()
    // element.setAttribute('aria-selected', 'true')
    console.log('moved', element)
  }

  moveIn() {
    const focused = this.shadowRoot.activeElement
    const nestedList = focused.querySelector('command-menu-list')
    if (nestedList) {
      nestedList.hidden = false
      const firstChild = nestedList.querySelector('command-menu-item')
      this.move(firstChild)
    }
  }

  moveOut() {
    const focused = this.shadowRoot.activeElement
    const parent = focused.parentElement
    const isChild = parent.closest('command-menu-item')
    if (parent && isChild) {
      parent.hidden = true
      this.move(parent.parentElement)
    }
  }

  movePrevious() {
    const focused = this.shadowRoot.activeElement
    let previous = focused.previousElementSibling
    if (!previous) previous = this.shadowRoot.querySelector('input[type=search]')
    this.move(previous)
  }

  moveNext() {
    const focused = this.shadowRoot.activeElement
    let next = focused.nextElementSibling
    if (!next && focused.type === 'search') {
      next = this.shadowRoot.querySelector('command-menu-item')
    }
    this.move(next)
  }

  selectCommand(command) {
    if (!command) command = this.shadowRoot.activeElement.item
    console.log('selected command', command)
    // if (selected?.action) selected.action()
    // this.close()
  }

  onClick(event) {
    if (event.target === this) {
      this.close()
    }
  }

  open() {
    this.removeAttribute('hidden')
    this.shadowRoot.querySelector('input[type=search]').focus()
  }

  close() {
    this.setAttribute('hidden', true)
  }

  toggle() {
    if (this.hasAttribute('hidden')) {
      this.open()
    } else {
      this.close()
    }
  }
}

class CommandMenuItem extends LitElement {
  static get properties() {
    return {
      item: { type: 'Object' },
    }
  }

  connectedCallback() {
    super.connectedCallback()
    // Make it focusable
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0
  }

  render() {
    const { title, subtitle, shortcut } = this.item
    return html`
    <command-menu-item-title>${title}</command-menu-item-title>
    <command-menu-item-subtitle>${subtitle}</command-menu-item-subtitle>
    ${shortcut ? html`<kbd>${shortcut}</kbd>` : null}
    
    ${this.item.children ? '...' : ''}
      ${this.item.children?.length ? html`
          <command-menu-list role="menu" hidden>
            ${this.item.children.map(item => html`
              <command-menu-item role="menuitem" .item=${item}></command-menu-item>
            `)}
          </command-menu-list>
      ` : null}
    `
  }

  createRenderRoot() {
    return this
  }
}

customElements.define('command-menu', CommandMenu)
customElements.define('command-menu-item', CommandMenuItem)
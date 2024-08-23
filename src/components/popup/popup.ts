import '@webcomponents/custom-elements'
import {
  BehaviorSubject,
  debounceTime,
  filter,
  forkJoin,
  fromEvent,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs'
import { QuakVimPanelItem } from '../../models/quak-vim-panel-item.model'
import { PopupType } from './models/popup-type.model'
import styles from './popup.css'
import { QuakVimItemType } from '../../models/quak-vim-item-type.model'

export class QuakVimPanel extends HTMLElement {
  private readonly dataSource$ = new BehaviorSubject<QuakVimPanelItem[]>([])
  private readonly destroy$ = new Subject<void>()
  // private readonly data$: Observable<QuakVimPanelItem[]> =
  //   this.dataSource$.pipe(
  //     map((data) =>
  //       data.map((result) => {
  //         result.li = this.createListItem(result)
  //         this.ul.appendChild(result.li)
  //         return result
  //       }),
  //     ),
  //   )
  private readonly ul = document.createElement('ul')
  readonly input = document.createElement('input')
  readonly inputEvent$ = fromEvent<KeyboardEvent>(this.input, 'keydown').pipe(
    tap((event) => event.stopImmediatePropagation()),
    debounceTime(10),
    filter(
      ({ key, ctrlKey }) =>
        !(ctrlKey && key !== 'x') ||
        !['Tab', 'Control', 'Shift', 'Alt'].includes(key),
    ),
  )

  static observedAttributes = ['listItems', 'with-selection']
  static classes = {
    active: 'quak-vim-popup-list-item__active',
    listItem: 'quak-vim-popup-list-item',
    input: 'quak-vim-popup__input',
    imageRow: 'quak-vim-popup-list-item__img-row',
    titleRow: 'quak-vim-popup-list-item__title-row',
    url: 'quak-vim-popup-list-item__url',
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.setInput()
    const style = document.createElement('style')
    style.textContent = styles
    this.shadowRoot!.appendChild(style)
    this.shadowRoot!.appendChild(this.ul)
  }

  connectedCallback() {
    this.input.focus()
    forkJoin([this.setupBackdropListener()])
      .pipe(takeUntil(this.destroy$))
      .subscribe()
  }

  setResults(results: QuakVimPanelItem[], mode: PopupType) {
    const data = results.map((result) => {
      result.li = this.createListItem(result)
      this.ul.appendChild(result.li)
      return result
    })

    this.dataSource$.next(data)

    if (mode === 'edit-tab') {
      this.input.value = window.location.href
    }

    return data
  }

  destroy() {
    this.destroy$.next()
    this.destroy$.complete()
    this.remove()
  }

  private setupBackdropListener(): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(document, 'click').pipe(
      filter(({ target }) => target !== this),
      tap(this.destroy.bind(this)),
    )
  }

  // private setupResultsListener(): Observable<{
  //   index: number
  //   data: QuakVimPanelItem[]
  // }> {
  //   return this.data$.pipe(
  //     takeUntil(this.destroy$),
  //     switchMap((results) =>
  //       this.inputEvent$.pipe(
  //         startWith(new KeyboardEvent('keydown')),
  //         scan(
  //           ({ index, data }, input) => {
  //             const handler = KeyHandlerFactory(input)
  //
  //             return handler.handle({
  //               index,
  //               data,
  //               total: results,
  //               searchTerm: this.input.value,
  //               defaultSelectionIndex: this.selectionIndex,
  //               callback: this.destroy.bind(this),
  //             })
  //           },
  //           { index: this.selectionIndex, data: results },
  //         ),
  //       ),
  //     ),
  //   )
  // }

  private setInput() {
    const span = document.createElement('span')
    span.setAttribute('class', 'quak-vim-popup__input-wrapper')
    span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
    </svg>`
    this.input.setAttribute('type', 'text')
    this.input.setAttribute('placeholder', 'Search')
    this.input.setAttribute('class', QuakVimPanel.classes.input)
    this.input.setAttribute('autocomplete', 'off')
    span.appendChild(this.input)
    this.shadowRoot!.appendChild(span)
  }

  disconnectedCallback() {
    console.log('Custom element removed from page.')
  }

  adoptedCallback() {
    console.log('Custom element moved to new page.')
  }

  attributeChangedCallback(
    name: string,
    _oldValue: unknown,
    _newValue: unknown,
  ) {
    name
  }

  private createListItem({
    url,
    favIconUrl,
    active,
    id,
    type,
  }: QuakVimPanelItem) {
    const chromeFavicon = new URL(chrome.runtime.getURL('/_favicon/'))
    chromeFavicon.searchParams.set('pageUrl', url || '')
    chromeFavicon.searchParams.set('size', '64')
    const src = favIconUrl?.startsWith('http')
      ? favIconUrl
      : chromeFavicon.toString()

    const li = document.createElement('li')
    li.style.display = 'none'
    li.classList.add(QuakVimPanel.classes.listItem)
    if (active) {
      li.classList.add(QuakVimPanel.classes.active)
    }
    li.setAttribute('data-tabid', (id || 0).toString())
    li.innerHTML = `
      <div class="${QuakVimPanel.classes.titleRow}">
      ${getSvgWithType(type)}
        <span></span>
      </div>
      <div class="${QuakVimPanel.classes.imageRow}">
        <img width="22" height="22" src="${src}" />
        <span class="${QuakVimPanel.classes.url}">${url}</span>
      </div>
    `
    return li
  }
}

customElements.define('quak-vim-popup', QuakVimPanel)

function getSvgWithType(type: QuakVimItemType) {
  return {
    tab: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
          <path
            d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM96 96l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
        </svg>`,
    history: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
       <path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9L0 168c0 13.3 10.7 24 24 24l110.1 0c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24l0 104c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65 0-94.1c0-13.3-10.7-24-24-24z" />
       </svg>
        `,
    bookmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" >
    <path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z" />
  </svg>`,
    'top-site': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" >
   <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 224L64 288 64 64l448 0z" />
</svg>`,
    'new-tab': '',
    'dom-node': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
    <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
</svg>`,
    'edit-tab': '',
  }[type]
}

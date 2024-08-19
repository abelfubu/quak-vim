import '@webcomponents/custom-elements'
import {
  BehaviorSubject,
  debounceTime,
  filter,
  forkJoin,
  fromEvent,
  map,
  merge,
  Observable,
  scan,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs'
import { QuakVimPanelItem } from '../../models/quak-vim-panel-item.model'
import { KeyHandlerFactory } from './key-handlers/key-handler.factory'
import { PopupType } from './models/popup-type.model'
import styles from './popup.css'

export class Popup extends HTMLElement {
  private readonly destroy$ = new Subject<void>()
  private readonly dataSource$ = new BehaviorSubject<QuakVimPanelItem[]>([])
  private readonly data$: Observable<QuakVimPanelItem[]> =
    this.dataSource$.pipe(
      map((data) =>
        data.map((result) => {
          result.li = this.createListItem(result)
          this.ul.appendChild(result.li)
          return result
        }),
      ),
    )
  private readonly ul = document.createElement('ul')
  private readonly input = document.createElement('input')
  private readonly inputEvent$ = fromEvent<KeyboardEvent>(
    this.input,
    'keydown',
  ).pipe(
    tap((event) => event.stopImmediatePropagation()),
    filter(
      ({ key, ctrlKey }) =>
        !(ctrlKey && key !== 'x') ||
        !['Tab', 'Control', 'Shift', 'Alt'].includes(key),
    ),
  )
  static observedAttributes = ['listItems']
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
    forkJoin([this.setupResultsListener(), this.setupBackdropListener()])
      .pipe(takeUntil(this.destroy$))
      .subscribe()
  }

  setResults(results: QuakVimPanelItem[], mode: PopupType) {
    this.dataSource$.next(results)

    if (mode === 'edit-tab') {
      this.input.value = window.location.href
    }
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

  private setupResultsListener(): Observable<{
    index: number
    data: QuakVimPanelItem[]
  }> {
    return this.data$.pipe(
      takeUntil(this.destroy$),
      switchMap((results) =>
        merge(
          this.inputEvent$.pipe(
            filter(({ key }) => !['ArrowUp', 'ArrowDown'].includes(key)),
            debounceTime(150),
          ),
          this.inputEvent$.pipe(
            filter(({ key }) => ['ArrowUp', 'ArrowDown'].includes(key)),
          ),
        ).pipe(
          startWith(new KeyboardEvent('keydown')),
          scan(
            ({ index, data }, input) => {
              const handler = KeyHandlerFactory(input)
              return handler.handle({
                data,
                index,
                total: results,
                searchTerm: this.input.value,
                callback: this.destroy.bind(this),
              })
            },
            { index: 1, data: results },
          ),
        ),
      ),
    )
  }

  private setInput() {
    const span = document.createElement('span')
    span.setAttribute('class', 'quak-vim-popup__input-wrapper')
    this.input.setAttribute('type', 'text')
    this.input.setAttribute('placeholder', 'Search')
    this.input.setAttribute('class', Popup.classes.input)
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

  attributeChangedCallback<T>(name: string, _oldValue: T, _newValue: T) {
    console.log(`Attribute ${name} has changed.`)
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
    li.classList.add(Popup.classes.listItem)
    if (active) {
      li.classList.add(Popup.classes.active)
    }
    li.setAttribute('data-tabid', (id || 0).toString())
    li.innerHTML = `
      <div class="${Popup.classes.titleRow}">
      ${getSvgWithType(type)}
        <span></span>
      </div>
      <div class="${Popup.classes.imageRow}">
        <img width="22" height="22" src="${src}" />
        <span class="${Popup.classes.url}">${url}</span>
      </div>
    `
    return li
  }
}

customElements.define('quak-vim-popup', Popup)

function getSvgWithType(type: 'tab' | 'history' | 'bookmark' | 'top-site') {
  return {
    tab: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
          <path
            d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM96 96l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
            fill="#555" />
        </svg>`,
    history: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
       <path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9L0 168c0 13.3 10.7 24 24 24l110.1 0c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24l0 104c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65 0-94.1c0-13.3-10.7-24-24-24z" 
         fill="#555"/>
       </svg>
        `,
    bookmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" height="18">
    <path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z"
    fill="#555"
    /></svg>`,
    'top-site': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18" height="18">
   <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 224L64 288 64 64l448 0z"
    fill="#555"/></svg>`,
  }[type]
}

import '@webcomponents/custom-elements';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  forkJoin,
  fromEvent,
  map,
  Observable,
  scan,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { capitalize } from '../../utils/capitalize.util';
import { KeyHandlerFactory } from './key-handlers/key-handler.factory';
import styles from './popup.css';

type PopupDataType = {
  id?: number;
  favIconUrl?: string;
  title?: string;
  url?: string;
  active?: boolean;
  li: HTMLLIElement;
};

export class Popup<T extends PopupDataType> extends HTMLElement {
  private readonly destroy$ = new Subject<void>();
  private readonly dataSource$ = new BehaviorSubject<T[]>([]);
  private readonly data$ = this.dataSource$.pipe(
    map((data) =>
      data.map((result) => {
        const li = this.createListItem(result);
        this.ul.appendChild(li);
        return { ...result, li };
      }),
    ),
  );
  private readonly ul = document.createElement('ul');
  private readonly input = document.createElement('input');
  private readonly inputEvent$ = fromEvent<KeyboardEvent>(
    this.input,
    'keydown',
  ).pipe(
    filter(
      ({ key, ctrlKey }) =>
        !(ctrlKey && key !== 'x') ||
        !['Tab', 'Control', 'Shift', 'Alt'].includes(key),
    ),
  );
  static observedAttributes = ['listItems'];
  static classes = {
    active: 'quak-vim-popup-list-item__active',
    listItem: 'quak-vim-popup-list-item',
    input: 'quak-vim-popup__input',
    imageRow: 'quak-vim-popup-list-item__img-row',
    titleRow: 'quak-vim-popup-list-item__title-row',
    url: 'quak-vim-popup-list-item__url',
  };

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const span = document.createElement('span');
    span.setAttribute('class', 'quak-vim-popup__input-wrapper');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('placeholder', 'Search');
    this.input.setAttribute('autocomplete', 'off');
    this.input.setAttribute('class', Popup.classes.input);
    span.appendChild(this.input);
    this.shadowRoot?.appendChild(span);

    const style = document.createElement('style');
    style.textContent = styles;
    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(this.ul);
  }

  connectedCallback() {
    this.input.focus();
    forkJoin([this.setupResultsListener(), this.setupBackdropListener()])
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  setResults(results: T[]) {
    this.dataSource$.next(results);
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.remove();
  }

  private setupBackdropListener(): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(document, 'click').pipe(
      filter(({ target }) => target !== this),
      tap(this.destroy.bind(this)),
    );
  }

  private setupResultsListener(): Observable<{
    index: number;
    data: T[];
  }> {
    return this.data$.pipe(
      takeUntil(this.destroy$),
      switchMap((results) =>
        this.inputEvent$.pipe(
          debounceTime(10),
          startWith(new KeyboardEvent('keydown')),
          scan(
            ({ index, data }, input) => {
              const handler = KeyHandlerFactory(input);
              return handler.handle<T>({
                data,
                index,
                total: results,
                searchTerm: this.input.value,
                callback: this.destroy.bind(this),
              });
            },
            { index: 0, data: results },
          ),
        ),
      ),
    );
  }

  disconnectedCallback() {
    console.log('Custom element removed from page.');
  }

  adoptedCallback() {
    console.log('Custom element moved to new page.');
  }

  attributeChangedCallback<T>(name: string, _oldValue: T, _newValue: T) {
    console.log(`Attribute ${name} has changed.`);
  }

  private createListItem({ title, url, favIconUrl, active, id }: T) {
    const chromeFavicon = new URL(chrome.runtime.getURL('/_favicon/'));
    chromeFavicon.searchParams.set('pageUrl', url || '');
    chromeFavicon.searchParams.set('size', '64');
    const src = favIconUrl?.startsWith('http')
      ? favIconUrl
      : chromeFavicon.toString();

    const li = document.createElement('li');
    li.classList.add(Popup.classes.listItem);
    if (active) {
      li.classList.add(Popup.classes.active);
    }
    li.setAttribute('data-tabid', (id || 0).toString());
    li.innerHTML = `
      <div class="${Popup.classes.titleRow}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
          <path
            d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM96 96l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
            fill="#555" />
        </svg>
        <span>${capitalize(title?.split('-')[0] || '')}</span>
      </div>
      <div class="${Popup.classes.imageRow}">
        <img width="22" height="22" src="${src}" />
        <span class="${Popup.classes.url}">${url}</span>
      </div>
    `;
    return li;
  }
}

customElements.define('quak-vim-popup', Popup);

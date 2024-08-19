import {
  filter,
  forkJoin,
  fromEvent,
  map,
  repeat,
  switchMap,
  take,
  tap,
} from 'rxjs'
import { QuakVimPanelItem } from './models/quak-vim-panel-item.model'
import { Popup } from './components/popup/popup'
import { MessageService } from './services/message/message.service'
import { DomService } from './services/dom/dom.service'

const keyboardEvent$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
  filter(
    ({ key }) =>
      key !== 'Escape' &&
      !(document.activeElement instanceof HTMLInputElement) &&
      !(document.activeElement instanceof HTMLTextAreaElement),
  ),
)

const quakVimPopupEvent$ = keyboardEvent$.pipe(take(1), repeat())

// keyboardEvent$
//   .pipe(filter(({ key }) => key === 'f' && !activeCommands.f))
//   .subscribe(() => {
//     activeCommands.f = true;
//     const highlighter = new Highlighter(keyboardEvent$);
//     highlighter.highlight(() => (activeCommands.f = false));
//   });

// keyboardEvent$
//   .pipe(
//     filter(({ key }) => key === 'j'),
//     throttleTime(400),
//   )
//   .subscribe(() => {
//     window.scrollBy({ top: 100, behavior: 'smooth' });
//   });
// keyboardEvent$.pipe(filter(({ key }) => key === 'k')).subscribe(() => {
//   window.scrollBy({ top: -100, behavior: 'smooth' });
// });

quakVimPopupEvent$
  .pipe(
    filter(({ key }) => key === 'o'),
    switchMap(() =>
      forkJoin([
        MessageService.sessions$('history'),
        MessageService.topSites$('history'),
        MessageService.bookmarks$('history'),
      ]),
    ),
    map(([sessions, topSites, bookmarks]) =>
      Array.from(
        topSites
          .concat(sessions, bookmarks)
          .reduce(
            (map, item) => map.set(item.url, item),
            new Map<string, QuakVimPanelItem>(),
          )
          .values(),
      ),
    ),
  )
  .subscribe((items) => {
    const popup = new Popup()
    popup.setResults(items, 'history')
    document.body.appendChild(popup)
  })

quakVimPopupEvent$
  .pipe(
    filter(({ key }) => key === 'T'),
    switchMap(() => MessageService.tabs$('tab')),
  )
  .subscribe((tabs) => {
    const popup = new Popup()
    document.body.appendChild(popup)
    popup.setResults(tabs, 'tab')
  })

quakVimPopupEvent$
  .pipe(
    filter(({ key }) => key === 'b'),
    switchMap(() => DomService.links$('edit-tab').pipe(tap(console.log))),
  )
  .subscribe((items) => {
    const popup = new Popup()
    document.body.appendChild(popup)
    popup.setResults(items, 'tab')
  })

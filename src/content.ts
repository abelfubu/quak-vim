import {
  filter,
  forkJoin,
  fromEvent,
  repeat,
  share,
  switchMap,
  take,
} from 'rxjs'
import { filterKeys } from './operators/filter-keys.operator'
import { openQuakVimPanel } from './operators/quak-vim-panel.operator'
import { DomService } from './services/dom/dom.service'
import { MessageService } from './services/message/message.service'

const keyboardEvent$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
  filter(
    ({ key }) =>
      key !== 'Escape' &&
      [HTMLInputElement, HTMLTextAreaElement].every(
        (element) => !(document.activeElement instanceof element)
      )
  )
)

const quakVimPopupEvent$ = keyboardEvent$.pipe(take(1), repeat(), share())

forkJoin([
  quakVimPopupEvent$.pipe(
    openQuakVimPanel({
      data: MessageService.history$('history'),
      defaultSelectionIndex: -1,
      keys: [{ ctrl: false, k: 'o' }],
    })
  ),
  quakVimPopupEvent$.pipe(
    openQuakVimPanel({
      data: MessageService.tabs$('tab'),
      defaultSelectionIndex: 0,
      keys: [{ ctrl: false, k: 'T' }],
    })
  ),
  quakVimPopupEvent$.pipe(
    openQuakVimPanel({
      data: DomService.links$('edit-tab'),
      defaultSelectionIndex: 0,
      keys: [{ ctrl: false, k: 'f' }],
    })
  ),
  keyboardEvent$.pipe(
    filterKeys({ ctrl: false, k: 'H' }),
    switchMap(() => MessageService.back$())
  ),
  keyboardEvent$.pipe(
    filterKeys({ ctrl: false, k: 'L' }),
    switchMap(() => MessageService.forward$())
  ),
]).subscribe()

import { debounceTime, Observable, scan, startWith, switchMap } from 'rxjs'
import { KeyHandlerFactory } from '../components/popup/key-handlers/key-handler.factory'
import { QuakVimPanel } from '../components/popup/popup'
import { QuakVimPanelItem } from '../models/quak-vim-panel-item.model'
import { filterKeys } from './filter-keys.operator'

/**
 * Opens a QuakVimPanel and returns the selected item
 * @param param0
 * @returns and object containing the index of the selected item and the items filtered by the search term
 */
export function openQuakVimPanel({
  data,
  defaultSelectionIndex,
  keys,
}: {
  data: Observable<QuakVimPanelItem[]>
  defaultSelectionIndex: number
  keys: (string | { ctrl: boolean; k: string })[]
}): (
  source: Observable<KeyboardEvent>
) => Observable<{ index: number; data: QuakVimPanelItem[] }> {
  return (source: Observable<KeyboardEvent>) =>
    source.pipe(
      debounceTime(10),
      filterKeys(...keys),
      switchMap(() => data),
      switchMap((items) => {
        const popup = new QuakVimPanel()
        document.body.appendChild(popup)
        const total = popup.setResults(items, 'tab')
        return popup.inputEvent$.pipe(
          startWith(new KeyboardEvent('keydown')),
          scan(
            ({ index, data }, input) => {
              const handler = KeyHandlerFactory(input)
              return handler.handle({
                index,
                data,
                total,
                searchTerm: popup.input.value,
                defaultSelectionIndex,
                callback: () => popup.destroy(),
              })
            },
            { index: defaultSelectionIndex, data: items }
          )
        )
      })
    )
}

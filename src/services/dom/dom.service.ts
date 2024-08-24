import { map, of } from 'rxjs'
import { QuakVimPanelItem } from '../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../models/quak-vim-panel-mode.model'
import {
  clickableElementAdapter,
  focusableElementAdapter,
} from './adapters/searchable-element.adapter'
import { isClickableElement } from './assertions/clickable-element'
import { isFocusableElement } from './assertions/focusable-element'

const searchableElements = [
  '[contentEditable=true]',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
]

export const DomService = {
  links$: (mode: QuakVimPanelMode) => {
    return of(
      document.body.querySelectorAll(searchableElements.join(','))
    ).pipe(
      map((items) =>
        Array.from(items)
          .reduce<Map<string, QuakVimPanelItem>>((visibleElements, element) => {
            if (isFocusableElement(element)) {
              const item = focusableElementAdapter(element, mode)
              return visibleElements.set(`${item.url}-${item.title}`, item)
            }

            if (isClickableElement(element)) {
              const item = clickableElementAdapter(element, mode)
              return visibleElements.set(`${item.url}-${item.title}`, item)
            }

            return visibleElements
          }, new Map<string, QuakVimPanelItem>())
          .values()
      ),
      map((results) => Array.from(results))
    )
  },
}

import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../../models/quak-vim-panel-mode.model'
import { isClickableElement } from '../assertions/clickable-element'
import { isFocusableElement } from '../assertions/focusable-element'

export function searchableElementAdapter(
  source: Element,
  mode: QuakVimPanelMode,
): QuakVimPanelItem {
  return {
    id: source.id,
    li: source as HTMLLIElement,
    type: 'dom-node',
    active: false,
    mode,
    url: source instanceof HTMLAnchorElement ? source.href : '',
    // action: () => {
    //   if (isClickableElement(source)) {
    //     source.click()
    //   }
    //
    //   if (isFocusableElement(source)) {
    //     source.focus()
    //   }
    // },
    title:
      (source instanceof HTMLAnchorElement && source.title) ||
      source.textContent ||
      '',
  }
}

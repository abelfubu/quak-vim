import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../../models/quak-vim-panel-mode.model'

export function searchableElementAdapter(
  source: HTMLElement,
  mode: QuakVimPanelMode,
): QuakVimPanelItem {
  return {
    id: source.id,
    li: source as HTMLLIElement,
    type: 'dom-node',
    active: false,
    mode,
    url: source instanceof HTMLAnchorElement ? source.href : '',
    action: () => {
      if (
        source instanceof HTMLAnchorElement ||
        source instanceof HTMLButtonElement
      ) {
        source.click()
      }

      if (
        source instanceof HTMLInputElement ||
        source instanceof HTMLTextAreaElement ||
        source instanceof HTMLSelectElement
      ) {
        source.focus()
      }
    },
    title:
      (source instanceof HTMLAnchorElement && source.title) ||
      source.textContent ||
      '',
  }
}

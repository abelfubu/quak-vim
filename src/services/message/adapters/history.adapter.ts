import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../../models/quak-vim-panel-mode.model'

export function historyAdapter(
  source: chrome.history.HistoryItem,
  mode: QuakVimPanelMode,
): QuakVimPanelItem {
  return {
    active: false,
    favIconUrl: '',
    id: source.id,
    li: document.createElement('li'),
    mode,
    title: source.title || '',
    type: 'history',
    url: source.url || '',
  }
}

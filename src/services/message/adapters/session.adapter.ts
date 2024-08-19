import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../../models/quak-vim-panel-mode.model'

export function sessionAdapter(
  item: chrome.tabs.Tab,
  mode: QuakVimPanelMode
): QuakVimPanelItem {
  return {
    active: false,
    favIconUrl: item.favIconUrl,
    id: item.id,
    li: document.createElement('li'),
    mode,
    title: item.title || item.url?.split('//')[1] || '',
    type: 'history',
    url: item.url || 'chrome://new-tab-page/',
  }
}

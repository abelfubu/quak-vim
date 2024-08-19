import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../../models/quak-vim-panel-mode.model'

export function topSiteAdapter(
  source: chrome.topSites.MostVisitedURL,
  mode: QuakVimPanelMode
): QuakVimPanelItem {
  return {
    favIconUrl: undefined,
    id: source.url,
    li: document.createElement('li'),
    mode,
    title: source.title,
    type: 'top-site',
    url: source.url,
  }
}

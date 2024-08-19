import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../../models/quak-vim-panel-mode.model'

export function bookmarkAdapter(
  source: chrome.bookmarks.BookmarkTreeNode,
  mode: QuakVimPanelMode
): QuakVimPanelItem {
  return {
    favIconUrl: source.url ? `chrome://favicon/${source.url}` : '',
    id: String(source.id),
    li: document.createElement('li'),
    mode,
    title: source.title,
    type: 'bookmark',
    url: source.url || '',
  }
}

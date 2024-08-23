import { map } from 'rxjs'
import { QuakVimPanelItem } from '../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../models/quak-vim-panel-mode.model'
import { bookmarkAdapter } from './adapters/bookmark.adapter'
import { sessionAdapter } from './adapters/session.adapter'
import { tabAdapter } from './adapters/tab.adapter'
import { topSiteAdapter } from './adapters/top-site.adapter'
import { message$ } from './messenger'
import { historyAdapter } from './adapters/history.adapter'

export const MessageService = {
  tabs$: (mode: QuakVimPanelMode) =>
    message$<chrome.tabs.Tab[]>({ request: 'get-tabs' }).pipe(
      map((tabs) =>
        tabs
          .sort((a, b) => (a.lastAccessed || 0) + (b.lastAccessed || 0))
          .reduce<
            QuakVimPanelItem[]
          >((acc, tab) => (tab ? acc.concat(tabAdapter(tab, mode)) : acc), []),
      ),
    ),

  sessions$: (mode: QuakVimPanelMode) =>
    message$<chrome.sessions.Session[]>({
      request: 'get-sessions',
    }).pipe(
      map((sessions) =>
        sessions.reduce<QuakVimPanelItem[]>(
          (acc, { tab }) => (tab ? acc.concat(sessionAdapter(tab, mode)) : acc),
          [],
        ),
      ),
    ),

  bookmarks$: (mode: QuakVimPanelMode) =>
    message$<chrome.bookmarks.BookmarkTreeNode[]>({
      request: 'get-bookmarks',
    }).pipe(
      map((bookmarks) =>
        bookmarks.reduce<QuakVimPanelItem[]>(
          (acc, bookmark) => acc.concat(extractChildren(bookmark, mode) || []),
          [],
        ),
      ),
    ),

  topSites$: (mode: QuakVimPanelMode) =>
    message$<chrome.topSites.MostVisitedURL[]>({
      request: 'get-topsites',
    }).pipe(
      map((topSites) =>
        topSites.reduce<QuakVimPanelItem[]>(
          (acc, topSite) =>
            topSite ? acc.concat(topSiteAdapter(topSite, mode)) : acc,
          [],
        ),
      ),
    ),

  history$: (mode: QuakVimPanelMode) =>
    message$<chrome.history.HistoryItem[]>({
      request: 'get-history',
    }).pipe(
      map((history) =>
        history.reduce<QuakVimPanelItem[]>(
          (acc, item) => (item ? acc.concat(historyAdapter(item, mode)) : acc),
          [],
        ),
      ),
    ),

  back$: () => message$<void>({ request: 'back' }),
  forward$: () => message$<void>({ request: 'forward' }),
}

function extractChildren(
  bookmark: chrome.bookmarks.BookmarkTreeNode,
  mode: QuakVimPanelMode,
): QuakVimPanelItem[] | undefined {
  return bookmark?.children?.reduce<QuakVimPanelItem[]>((acc, child) => {
    if (child?.url) {
      acc.push(bookmarkAdapter(child, mode))
    } else {
      return acc.concat(extractChildren(child, mode) || [])
    }

    return acc
  }, [])
}

import { KeyHandler } from './key-handler.model'

export const ConfirmSelectionHandler: KeyHandler = {
  handle({ data, index, searchTerm, callback }) {
    const activeTab = data.find((_, i) => i === index)

    if (activeTab?.type === 'dom-node' && activeTab?.action) {
      activeTab.action()
      callback?.()
      return { data, index }
    }

    chrome.runtime.sendMessage(
      {
        request: 'activate-tab',
        result: activeTab,
        query: searchTerm,
      },
      callback || (() => {})
    )

    return { data, index }
  },
}

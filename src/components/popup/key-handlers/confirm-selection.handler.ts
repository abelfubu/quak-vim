import { KeyHandler } from './key-handler.model'

export const ConfirmSelectionHandler: KeyHandler = {
  handle({ data, index, searchTerm, callback }) {
    const activeTab = data.find((_, i) => i === index)

    chrome.runtime.sendMessage(
      {
        request: 'activate-tab',
        result: activeTab,
        query: searchTerm,
      },
      callback || (() => {}),
    )

    return { data, index }
  },
}

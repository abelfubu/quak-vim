import { Message } from './services/message/models/message.model'

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse) => {
    if (message.request === 'forward') {
      chrome.tabs.goForward()
    }

    if (message.request === 'back') {
      chrome.tabs.goBack()
    }

    if (message.request === 'get-tabs') {
      chrome.tabs.query({}).then(sendResponse)
    }

    if (message.request === 'get-sessions') {
      chrome.sessions
        .getRecentlyClosed({ maxResults: chrome.sessions.MAX_SESSION_RESULTS })
        .then(sendResponse)
    }

    if (message.request === 'get-topsites') {
      chrome.topSites.get().then(sendResponse)
    }
    if (message.request === 'get-bookmarks') {
      chrome.bookmarks.getTree().then(sendResponse)
    }

    if (message.request === 'activate-tab') {
      if (!message.result) {
        return chrome.tabs.update({ url: message.query }).then(sendResponse)
        // return chrome.search.query({ text: message.query }).then(sendResponse)
      }

      if (message.result.type === 'tab') {
        return chrome.windows
          .update(message.result.windowId, { focused: true })
          .then(() => {
            return chrome.tabs
              .update(Number(message.result?.id), { active: true })
              .then(() => sendResponse(true))
          })
      }

      if (message.result.mode === 'new-tab') {
        return chrome.tabs
          .create({ url: message.result.url })
          .then(sendResponse)
      }

      chrome.tabs.query({ currentWindow: true, active: true }).then(([tab]) => {
        chrome.tabs
          .update(Number(tab.id), { url: message.result.url })
          .then(() => sendResponse(true))
      })
    }

    if (message.request === 'close-tab') {
      chrome.tabs.remove(Number(message.result.id)).then(sendResponse)
    }

    if (message.request === 'get-history') {
      chrome.history.search({ text: '', maxResults: 500 }).then(sendResponse)
    }

    return true
  },
)

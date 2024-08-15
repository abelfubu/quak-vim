console.log('BACKGROUND');

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.request === 'get-actions') {
    chrome.tabs.query({}).then((tabs) => sendResponse({ actions: tabs }));
  }

  if (message.request === 'activate-tab') {
    chrome.windows.update(message.tab.windowId, { focused: true }).then(() => {
      chrome.tabs
        .update(message.tab.id, { active: true })
        .then(() => sendResponse(true));
    });
  }

  if (message.request === 'close-tab') {
    chrome.tabs.remove(message.id).then(() => sendResponse(true));
  }

  return true;
});

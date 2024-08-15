import { KeyHandler } from './key-handler.model';

export const ConfirmSelectionHandler: KeyHandler = {
  handle({ data, index, callback }) {
    const activeTab = data.find((_, i) => i === index);

    if (!activeTab) return { data, index };

    chrome.runtime.sendMessage(
      { request: 'activate-tab', tab: activeTab },
      callback || (() => {}),
    );

    return { data, index };
  },
};

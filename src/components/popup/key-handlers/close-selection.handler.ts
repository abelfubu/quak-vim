import { Popup } from '../popup'
import { KeyHandler } from './key-handler.model'

export const CloseSelectionHandler: KeyHandler = {
  handle({ data, index, total }) {
    const activeTab = data.find((_, i) => i === index)

    if (!activeTab) return { data, index }

    chrome.runtime.sendMessage({ request: 'close-tab', result: activeTab })

    total.splice(index, 1)
    activeTab.li.remove()

    const nextIndex = index ? index - 1 : 0
    data[nextIndex].li.classList.add(Popup.classes.active)

    return {
      data: data.filter((_, i) => i !== index),
      index: nextIndex,
    }
  },
}

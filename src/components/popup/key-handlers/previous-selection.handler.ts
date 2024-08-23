import { QuakVimPanel } from '../popup'
import { KeyHandler } from './key-handler.model'

export const PreviousSelectionHandler: KeyHandler = {
  handle({ data, index }) {
    data[index]?.li.classList.remove(QuakVimPanel.classes.active)
    const newIndex = index ? index - 1 : data.length - 1
    data[newIndex]?.li.classList.add(QuakVimPanel.classes.active)

    return {
      data,
      index: newIndex,
    }
  },
}

import { QuakVimPanel } from '../popup'
import { KeyHandler } from './key-handler.model'

export const NextSelectionHandler: KeyHandler = {
  handle({ data, index }) {
    const newIndex = index === -1 || index === data.length - 1 ? 0 : index + 1
    data[index]?.li.classList.remove(QuakVimPanel.classes.active)
    data[newIndex]?.li.classList.add(QuakVimPanel.classes.active)

    return {
      data,
      index: newIndex,
    }
  },
}

import { QuakVimPanelClasses } from '../models/quak-vim-panel-css.enum'
import { KeyHandler } from './key-handler.model'

export const PreviousSelectionHandler: KeyHandler = {
  handle({ data, index }) {
    data[index]?.li.classList.remove(QuakVimPanelClasses.active)
    const newIndex = index ? index - 1 : data.length - 1
    data[newIndex]?.li.classList.add(QuakVimPanelClasses.active)

    return {
      data,
      index: newIndex,
    }
  },
}

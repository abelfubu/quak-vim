import { QuakVimPanelClasses } from '../models/quak-vim-panel-css.enum'
import { KeyHandler } from './key-handler.model'

export const NextSelectionHandler: KeyHandler = {
  handle({ data, index }) {
    const newIndex = index === -1 || index === data.length - 1 ? 0 : index + 1
    data[index]?.li.classList.remove(QuakVimPanelClasses.active)
    data[newIndex]?.li.classList.add(QuakVimPanelClasses.active)

    return {
      data,
      index: newIndex,
    }
  },
}

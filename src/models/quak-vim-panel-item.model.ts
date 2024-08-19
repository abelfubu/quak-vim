import { QuakVimItemType } from './quak-vim-item-type.model'
import { QuakVimPanelMode } from './quak-vim-panel-mode.model'

export type QuakVimPanelItem =
  | {
      active: boolean
      id?: number | string
      type: Exclude<QuakVimItemType, 'tab'>
      favIconUrl?: string
      li: HTMLLIElement
      mode: QuakVimPanelMode
      title: string
      url: string
      action: () => void
    }
  | {
      active: boolean
      favIconUrl?: string
      id?: number
      li: HTMLLIElement
      mode: QuakVimPanelMode
      title: string
      type: 'tab'
      url: string
      action: () => void
      windowId: number
    }

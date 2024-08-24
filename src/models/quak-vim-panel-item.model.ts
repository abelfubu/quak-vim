import { QuakVimItemType } from './quak-vim-item-type.model'
import { QuakVimPanelMode } from './quak-vim-panel-mode.model'

export type QuakVimPanelItem =
  | {
      active: boolean
      favIconUrl?: string
      id?: number | string
      li: HTMLLIElement
      mode: QuakVimPanelMode
      title: string
      type: Exclude<QuakVimItemType, 'tab' | 'dom-node'>
      url: string
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
      windowId: number
    }
  | {
      active: boolean
      favIconUrl?: string
      id: string
      li: HTMLLIElement
      mode: QuakVimPanelMode
      title: string
      type: 'dom-node'
      url: string
      action: () => void
    }

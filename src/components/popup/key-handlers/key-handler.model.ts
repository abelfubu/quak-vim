import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'

interface HandlerParams {
  data: QuakVimPanelItem[]
  total: QuakVimPanelItem[]
  index: number
  searchTerm: string
  callback?: () => void
}
export interface KeyHandler {
  handle(params: HandlerParams): { data: QuakVimPanelItem[]; index: number }
}

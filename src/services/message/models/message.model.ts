import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'
import { MessageRequest } from './message-request.type'

type MessageRequestWithTab = Extract<
  MessageRequest,
  'activate-tab' | 'close-tab' | 'get-history'
>
type SimpleMessageRequest = Exclude<
  MessageRequest,
  'activate-tab' | 'close-tab'
>

export type Message =
  | { request: SimpleMessageRequest }
  | {
      request: MessageRequestWithTab
      result: QuakVimPanelItem
      query: string
    }

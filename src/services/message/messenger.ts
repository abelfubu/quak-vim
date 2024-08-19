import { bindCallback } from 'rxjs';
import { Message } from './models/message.model';

export const message$ = bindCallback(
  chrome.runtime.sendMessage as <T>(
    message: Message,
    callback: (response: T) => void,
  ) => void,
);

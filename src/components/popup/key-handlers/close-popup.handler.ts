import { KeyHandler } from './key-handler.model';

export const ClosePopupHandler: KeyHandler = {
  handle({ data, index, callback }) {
    callback?.();
    return { data, index };
  },
};

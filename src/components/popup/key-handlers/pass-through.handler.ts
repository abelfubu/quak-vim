import { KeyHandler } from './key-handler.model';

export const PassThroughHandler: KeyHandler = {
  handle({ data, index }) {
    return { data, index };
  },
};

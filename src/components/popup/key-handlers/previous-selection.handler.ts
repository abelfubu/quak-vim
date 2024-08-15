import { Popup } from '../popup';
import { KeyHandler } from './key-handler.model';

export const PreviousSelectionHandler: KeyHandler = {
  handle({ data, index }) {
    const newIndex = index ? index - 1 : data.length - 1;

    data[index].li.classList.remove(Popup.classes.active);
    data[newIndex].li.classList.add(Popup.classes.active);

    return {
      data,
      index: newIndex,
    };
  },
};

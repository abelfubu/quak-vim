import { Popup } from '../popup';
import { KeyHandler } from './key-handler.model';

export const NextSelectionHandler: KeyHandler = {
  handle({ data, index }) {
    const newIndex = index === data.length - 1 ? 0 : index + 1;
    data[index].li.classList.remove(Popup.classes.active);
    data[newIndex].li.classList.add(Popup.classes.active);

    return {
      data,
      index: newIndex,
    };
  },
};

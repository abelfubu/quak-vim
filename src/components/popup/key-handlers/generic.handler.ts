import { normalize } from '../../../utils/normalize.util';
import { Popup } from '../popup';
import { KeyHandler } from './key-handler.model';

export const GenericHandler: KeyHandler = {
  handle({ total, searchTerm }) {
    const filtered = total.filter((result) => {
      result.li.classList.remove(Popup.classes.active);
      const title = normalize(result.title || '');
      const url = normalize(result.url || '');
      const match = `${title} ${url}`.includes(normalize(searchTerm));

      result.li.style.display = match ? 'block' : 'none';

      return match;
    });

    filtered[0]?.li.classList.add(Popup.classes.active);

    return {
      index: 0,
      data: filtered,
    };
  },
};

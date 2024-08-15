import Fuse from 'fuse.js';
import { highlightMatches } from '../../../utils/highlight-matches.util';
import { Popup } from '../popup';
import { KeyHandler } from './key-handler.model';

export const GenericHandler: KeyHandler = {
  handle({ total, searchTerm, data, index }) {
    data[index]?.li.classList.remove(Popup.classes.active);
    const ul = total[0]?.li.parentElement;

    if (!searchTerm) {
      total.forEach((item) => {
        item.li.style.display = 'block';
        const url = item.li.querySelector(`.${Popup.classes.url}`)!;
        const title = item.li.querySelector(`.${Popup.classes.titleRow} span`)!;
        url.textContent = String(item.url);
        title.textContent = String(item.title);
        ul?.appendChild(item.li);
      });

      total[0]?.li.classList.add(Popup.classes.active);

      return {
        index,
        data: total,
      };
    }

    const fuse = new Fuse(total, {
      keys: ['title', 'url'],
      includeMatches: true,
    });

    const filtered = fuse.search(searchTerm);

    total.forEach((item) => {
      item.li.style.display = 'none';
    });

    filtered[0]?.item?.li.classList.add(Popup.classes.active);

    return {
      index: 0,
      data: filtered.map(({ item, matches }) => {
        ul?.appendChild(item.li);
        item.li.style.display = 'block';

        matches?.forEach(({ indices, value, key }) => {
          const getElement = getElementFactory(key as 'url' | 'title', item.li);
          const element = getElement();

          if (!element) return;

          element.innerHTML = highlightMatches(String(value), indices);
        });

        return item;
      }),
    };
  },
};

function getElementFactory(element: 'url' | 'title', li: HTMLLIElement) {
  return {
    url: () => li.querySelector(`.${Popup.classes.url}`),
    title: () => li.querySelector(`.${Popup.classes.titleRow} span`),
  }[element];
}

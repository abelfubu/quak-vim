import Fuse from 'fuse.js'
import { highlightMatches } from '../../../utils/highlight-matches.util'
import { QuakVimPanelClasses } from '../models/quak-vim-panel-css.enum'
import { KeyHandler } from './key-handler.model'

const MAX_RESULTS = 10

export const GenericHandler: KeyHandler = {
  handle({ total, searchTerm, index, defaultSelectionIndex, data }) {
    const ul = total[0]?.li.parentElement
    data[index]?.li.classList.remove(QuakVimPanelClasses.active)

    if (!searchTerm) {
      total.slice(0, MAX_RESULTS).forEach((item) => {
        item.li.style.display = 'flex'
        const url = item.li.querySelector(`.${QuakVimPanelClasses.url}`)!
        const title = item.li.querySelector(
          `.${QuakVimPanelClasses.titleRow} span`
        )!
        url.textContent = String(item.url)
        title.textContent = String(item.title)
        ul?.appendChild(item.li)
      })

      total
        .slice(MAX_RESULTS)
        .forEach((item) => (item.li.style.display = 'none'))

      total[defaultSelectionIndex]?.li.classList.add(QuakVimPanelClasses.active)

      return {
        index,
        data: total.slice(0, MAX_RESULTS),
      }
    }

    const fuse = new Fuse(total, {
      keys: ['title', 'url'],
      includeMatches: true,
    })

    const filtered = fuse.search(searchTerm)
    filtered[defaultSelectionIndex]?.item.li.classList.add(
      QuakVimPanelClasses.active
    )

    total.forEach((item) => (item.li.style.display = 'none'))

    return {
      index,
      data: filtered.slice(0, MAX_RESULTS).map(({ item, matches }) => {
        ul?.appendChild(item.li)
        item.li.style.display = 'flex'

        matches?.forEach(({ indices, value, key }) => {
          const getElement = getElementFactory(key as 'url' | 'title', item.li)
          const element = getElement()

          if (!element) return

          element.innerHTML = highlightMatches(String(value), indices)
        })

        return item
      }),
    }
  },
}

function getElementFactory(element: 'url' | 'title', li: HTMLLIElement) {
  return {
    url: () => li.querySelector(`.${QuakVimPanelClasses.url}`),
    title: () => li.querySelector(`.${QuakVimPanelClasses.titleRow} span`),
  }[element]
}

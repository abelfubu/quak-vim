import Fuse from 'fuse.js'
import { highlightMatches } from '../../../utils/highlight-matches.util'
import { QuakVimPanel } from '../popup'
import { KeyHandler } from './key-handler.model'

const MAX_RESULTS = 10

export const GenericHandler: KeyHandler = {
  handle({ total, searchTerm, index, defaultSelectionIndex, data }) {
    const ul = total[0]?.li.parentElement
    data[index]?.li.classList.remove(QuakVimPanel.classes.active)

    if (!searchTerm) {
      total.slice(0, MAX_RESULTS).forEach((item) => {
        item.li.style.display = 'block'
        const url = item.li.querySelector(`.${QuakVimPanel.classes.url}`)!
        const title = item.li.querySelector(
          `.${QuakVimPanel.classes.titleRow} span`,
        )!
        url.textContent = String(item.url)
        title.textContent = String(item.title)
        ul?.appendChild(item.li)
      })

      total
        .slice(MAX_RESULTS)
        .forEach((item) => (item.li.style.display = 'none'))

      total[defaultSelectionIndex]?.li.classList.add(
        QuakVimPanel.classes.active,
      )

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
      QuakVimPanel.classes.active,
    )

    total.forEach((item) => (item.li.style.display = 'none'))

    return {
      index,
      data: filtered.slice(0, MAX_RESULTS).map(({ item, matches }) => {
        ul?.appendChild(item.li)
        item.li.style.display = 'block'

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
    url: () => li.querySelector(`.${QuakVimPanel.classes.url}`),
    title: () => li.querySelector(`.${QuakVimPanel.classes.titleRow} span`),
  }[element]
}

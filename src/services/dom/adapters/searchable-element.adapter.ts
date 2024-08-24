import { QuakVimPanelItem } from '../../../models/quak-vim-panel-item.model'
import { QuakVimPanelMode } from '../../../models/quak-vim-panel-mode.model'

export function clickableElementAdapter(
  source: Element,
  mode: QuakVimPanelMode
): QuakVimPanelItem {
  return {
    id: source.id,
    li: source as HTMLLIElement,
    type: 'dom-node',
    active: false,
    mode,
    url: source instanceof HTMLAnchorElement ? source.href : '',
    action: () => {
      console.log('[clickableElementAdapter] source:', {
        source,
        tagName: source.tagName,
      })
      ;(source as HTMLButtonElement).click()
    },
    title: getClickableTitle(source as HTMLButtonElement),
  }
}

export function focusableElementAdapter(
  source: Element,
  mode: QuakVimPanelMode
): QuakVimPanelItem {
  return {
    id: source.id,
    li: source as HTMLLIElement,
    type: 'dom-node',
    active: false,
    mode,
    url: '',
    action: () => {
      console.log('[focusableElementAdapter] source:', {
        source,
        tagName: source.tagName,
        type: (source as HTMLInputElement).type,
      })

      if (
        source instanceof HTMLInputElement &&
        (source.type === 'checkbox' || source.type === 'radio')
      ) {
        source.addEventListener('click', console.log)
        // source.checked = !source.checked
        // source.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        source.click()
      } else if (source instanceof HTMLInputElement) {
        source.select()
      } else {
        ;(source as HTMLInputElement).focus()
      }
    },
    title:
      getFocusableTitle(
        source as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      ) || '',
  }
}

function getFocusableTitle(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
) {
  let r = ''
  if (element.ariaLabel) r = element.ariaLabel
  else if (element.title) r = element.title
  else if (element.id) {
    const t = document.querySelector(
      `[for="${element.id}"]`
    ) as HTMLLabelElement
    t && (r = t.innerText)
  } else if (element.getAttribute('aria-labelledby')) {
    const t = document.getElementById(
      String(element.getAttribute('aria-labelledby'))
    )
    t && (r = t.innerText)
  } else r = (element as HTMLInputElement).placeholder
  return r ? `${r} Input` : null
}

function getClickableTitle(e: HTMLButtonElement) {
  if (e.dataset.tooltip) return e.dataset.tooltip
  if (e.title) return e.title
  if (e.ariaLabel) return e.ariaLabel
  if (e.getAttribute('aria-labelledby')) {
    const r = document.getElementById(e.getAttribute('aria-labelledby') || '')
    if (r) return r.innerText
  }
  return e.innerText
}

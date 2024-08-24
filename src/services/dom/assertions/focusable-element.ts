export function isFocusableElement(
  source: Element
): source is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  return (
    source instanceof HTMLInputElement ||
    source instanceof HTMLTextAreaElement ||
    source instanceof HTMLSelectElement ||
    source.hasAttribute('contenteditable')
  )
}

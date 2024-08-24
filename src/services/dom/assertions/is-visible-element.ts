export function isVisibleElement(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  console.log({ element, rect })
  return (
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    element.getAttribute('tabindex') !== '-1'
  )
}

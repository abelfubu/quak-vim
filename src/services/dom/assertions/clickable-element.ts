export function isClickableElement(
  source: Element
): source is HTMLButtonElement | HTMLAnchorElement {
  return (
    source instanceof HTMLButtonElement || source instanceof HTMLAnchorElement
  );
}


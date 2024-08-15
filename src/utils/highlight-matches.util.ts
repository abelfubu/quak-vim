import { RangeTuple } from 'fuse.js';

export function highlightMatches(
  text: string,
  indices: readonly RangeTuple[],
): string {
  let highlightedText = '';
  let lastIndex = 0;

  indices.forEach(([start, end]) => {
    // Add the part before the match
    highlightedText += text.slice(lastIndex, start);

    // Add the matched part wrapped in <span> with the highlight class
    highlightedText += `<span class="quak-vim-popup-list-item__highlight">${text.slice(
      start,
      end + 1,
    )}</span>`;

    // Update the lastIndex to end + 1 to move past this match
    lastIndex = end + 1;
  });

  // Add the remaining part of the text after the last match
  highlightedText += text.slice(lastIndex);

  return highlightedText;
}

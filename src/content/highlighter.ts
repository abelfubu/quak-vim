import { filter, Observable, scan, Subscription, tap } from 'rxjs';

export class Highlighter {
  private readonly wrapper = document.createElement('div');
  private readonly eventSubscription: Subscription;
  private readonly keys: string[] = [];
  private readonly linkMap = new Map<string, HTMLElement>();
  private cleanFn = () => {};

  private readonly controller = new AbortController();

  constructor(event$: Observable<KeyboardEvent>) {
    this.addWrapper();
    this.eventSubscription = event$
      .pipe(
        tap((event) => {
          if (event.key === 'Escape') {
            this.destroy();
          }
        }),
        filter((event) => event.key.length === 1),
        scan((acc, event) => {
          if (this.isKeyValid(event, acc)) {
            return '';
          }

          return acc + event.key;
        }, ''),
      )
      .subscribe((key) => {
        const link = this.linkMap.get(key);

        if (link) {
          this.linkMap.get(key)?.click();
          this.destroy();
        }
      });
  }

  public highlight(cleanFn: () => void) {
    document.body.appendChild(this.wrapper);
    this.createLinksHighlight();
    this.cleanFn = cleanFn;
  }

  public destroy() {
    this.wrapper.parentElement?.removeChild(this.wrapper);
    this.eventSubscription.unsubscribe();
    this.controller.abort();
    this.cleanFn();
  }

  private addWrapper() {
    this.wrapper.classList.add('quak-vim-highlighter-wrapper');
    document.body.appendChild(this.wrapper);
  }

  private createLinksHighlight() {
    const keySource = 'sadfjklewcmpgh';
    const links = document.querySelectorAll('a');
    const totalKeys = keySource.length;

    links.forEach((a, i) => {
      const span = document.createElement('span');
      span.classList.add('quak-vim-link-highlighted');
      const keys =
        links.length > totalKeys
          ? this.generateTwoLetterCombinations(keySource, links.length)
          : keySource;
      const key = keys[i];

      this.linkMap.set(key, a);
      links[i].setAttribute('data-key', key); // Use the full key for the attribute
      this.keys.push(key);
      span.textContent = key;
      const { top, left } = a.getBoundingClientRect();
      span.style.top = `${top + window.scrollY}px`;
      span.style.left = `${left + window.scrollX}px`;
      this.wrapper.appendChild(span);
    });
  }

  private generateTwoLetterCombinations(
    keySource: string,
    linksLength: number,
  ): string[] {
    const combinations: string[] = [];

    for (const i of keySource) {
      for (const j of keySource) {
        combinations.push(i + j);
        if (combinations.length === linksLength) {
          return combinations;
        }
      }
    }

    return combinations;
  }

  private isKeyValid(event: KeyboardEvent, acc: string): boolean {
    return !this.keys.some(
      (key) => key.startsWith(event.key) || key.startsWith(acc + event.key),
    );
  }
}

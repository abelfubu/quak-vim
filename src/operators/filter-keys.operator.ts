import { filter, MonoTypeOperatorFunction, Observable } from 'rxjs'

/**
 * @params
 * keys: Partial<KeyboardEvent>
 * @usage
 * fromEvent<KeyboardEvent>(document.body, 'keydown').pipe(
 *  filterKeys({ ctrl: false, k: 'c' }, { ctrl: true, k: 'a'}),
 *  filterKeys('f', { ctrl: true, k: 'a' }, 'h'),
 *  filterKeys('f', 'g', 'h'),
 *)
 **/

export function filterKeys<T extends KeyboardEvent>(
  ...keys: (string | { ctrl: boolean; k: string })[]
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.pipe(
      filter(({ ctrlKey, key }) =>
        keys.every((k) =>
          typeof k === 'string' ? key === k : ctrlKey === k.ctrl && key === k.k,
        ),
      ),
    )
}

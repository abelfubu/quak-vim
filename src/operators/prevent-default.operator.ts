import { MonoTypeOperatorFunction, tap } from 'rxjs'

export function preventDefault<T extends Event>(): MonoTypeOperatorFunction<T> {
  return (source) => source.pipe(tap((e) => e.preventDefault()))
}

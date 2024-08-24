export function getUniquesByKey<T, U extends keyof T>(
  source: T[],
  keys: U[]
): T[] {
  return Array.from(
    source
      .reduce(
        (map, item) =>
          map.set(keys.map((k) => String(item[k])).join('-'), item),
        new Map<string, T>()
      )
      .values()
  )
}

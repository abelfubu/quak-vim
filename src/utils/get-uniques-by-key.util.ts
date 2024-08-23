export function getUniquesByKey<T, U extends keyof T>(
  source: T[],
  key: U,
): T[] {
  return Array.from(
    source
      .reduce((map, item) => map.set(item[key], item), new Map<T[U], T>())
      .values(),
  )
}

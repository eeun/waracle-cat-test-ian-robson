export function groupBySum<TItem, TKey>(
  items: Iterable<TItem>, 
  groupBy: (item: TItem) => TKey, 
  sum: (item: TItem) => number
) {
  const result = new Map<TKey, number>()
  for (const item of items){
    const key = groupBy(item)
    result.set(key, (result.get(key) ?? 0) + sum(item))
  }
  return result
}

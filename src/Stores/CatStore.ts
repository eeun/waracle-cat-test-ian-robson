import { useSuspenseQuery } from '@tanstack/react-query'
import { theCatAPI } from '../lib/api'

export const CAT_STORE_KEY = 'catlist'

export function useCatStore(subId: string | undefined, page = 0, limit = 24) {
  const q = subId
    ? {
        limit,
        page,
        subId,
      }
    : {
        limit,
        page,
      }
  const query = useSuspenseQuery({
    queryKey: [CAT_STORE_KEY, subId, page, limit],
    queryFn: async () => {
      return limit === 0 ? [] : await theCatAPI.images.getImages(q)
    },
    staleTime: 30 * 60 * 1000, // refresh cats every 30 minutes
  })
  return query
}

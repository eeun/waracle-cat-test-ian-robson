import { useQuery } from '@tanstack/react-query'
import { theCatAPI } from '../lib/api'

export function useFavouriteStore(subId: string | null) {
  const query = useQuery({
    queryKey: ['favourites', subId],
    queryFn: async () => {
      return subId === null
        ? []
        : await theCatAPI.favourites.getFavourites(subId)
    },
    // staleTime: doesn't go stale
  })
  return query
}

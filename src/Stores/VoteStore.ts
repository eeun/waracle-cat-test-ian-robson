import { useQuery } from '@tanstack/react-query'
import { theCatAPI } from '../lib/api'

export function useVoteStore(subId?: string) {
  const query = useQuery({
    queryKey: ['votes', subId],
    queryFn: async () => {
      return await theCatAPI.votes.getVotes(subId)
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
  return query
}

import { type UserImage } from '@thatapicompany/thecatapi/dist/types.d'
import { useSubStore } from '../Stores/SubStore'
import { useFavouriteStore } from '../Stores/FavouriteStore'
import { theCatAPI } from '../lib/api'
import { useMemo, useState } from 'react'
import { useVoteStore } from '../Stores/VoteStore'
import IconActionButton from './IconActionButton'
import { groupBySum } from '../lib/collections'

function CatList({ cats }: { cats: Array<UserImage> }) {
  const subStore = useSubStore()
  const favStore = useFavouriteStore(subStore.subId)
  const voteStore = useVoteStore()

  // for busy indicator while favouriting a cat: catId or ''
  const [favouriting, setFavouriting] = useState('')
  // for busy indicator while voting on a cat - catId and vote direction
  const [voting, setVoting] = useState(['', 0] as [string, number])

  // select imageId, sum(value) from voteStore.data group by imageId
  const voteCounts = useMemo(() => groupBySum(
    voteStore.data ?? [],
    x => x.imageId,
    x => x.value
  ), [voteStore.data])
  const myVotes = useMemo(() => Object.fromEntries(
    voteStore.data
      ?.filter(x => x.subId === subStore.subId)
      .map(x => [x.imageId, x]) ?? []
  ), [voteStore.data, subStore.subId])
  const myFaves = Object.fromEntries(
    favStore.data
      ?.map(x => [x.imageId, x]) ?? []
  )

  async function toggleFavourite(imageId: string) {
    if (!subStore.subId) return subStore.openDialog()
    if (favouriting || !favStore.isFetched) return
    setFavouriting(imageId)
    const fav = myFaves?.[imageId]
    try {
      if (fav === undefined)
        await theCatAPI.favourites.addFavourite(imageId, subStore.subId)
      else
        await theCatAPI.favourites.deleteFavourite(fav?.id)
    } catch (e) {
      console.error('Error favouriting cat', e)
      // todo: probably trying to (un)fave already (un)favourited
      // a refetch will likely fix it but might want to handle properly
    }
    await favStore.refetch()
    setFavouriting('')
  }

  async function addVote(imageId: string, vote: 1 | 0 | -1) {
    if (!subStore.subId) return subStore.openDialog()
    if (voting[0] || !voteStore.isFetched) return

    // if the currentVote is the same as what we'd like to vote for
    const currentVote = myVotes[imageId]
    if ((currentVote?.value ?? 0) === vote) return

    setVoting([imageId, vote])
    // we don't need to delete the vote in the api if changing a vote
    if (currentVote && vote === 0) {
      try {
        await theCatAPI.votes.deleteVote(currentVote.id)
      } catch (e) {
        console.error('Error deleting cat vote', e)
        // todo: probably trying to remove a nonexistant vote
        // a refetch will likely fix it but might want to handle properly
      }
    }
    if (vote !== 0) {
      await theCatAPI.votes.addVote({
        imageId,
        value: vote,
        subId: subStore.subId,
      })
    }
    await voteStore.refetch()
    setVoting(['', 0])
  }

  return (
    <ul className="catlist">
      {cats.map((image) => {
        const isFav = Boolean(
          favStore.data?.find((x) => x.imageId === image.id)
        )
        const hasVote = myVotes[image.id]?.value
        const busyFav = image.id === favouriting
        const busyVote = voting[0] === image.id ? voting[1] : false
        const voteCount = voteCounts.get(image.id) ?? 0
        return (
          <li key={image.id}>
            {favStore.isFetched && (
              <div className="favourite-button fade-in-on-create">
                <IconActionButton
                  busy={busyFav}
                  title={isFav ? 'Unfavourite this cat' : 'Favourite this cat'}
                  selected={isFav}
                  icon="icon-heart-empty"
                  iconSelected="icon-heart"
                  onClick={() => toggleFavourite(image.id)}
                />
              </div>
            )}

            {voteStore.isFetched && (
              <div className="vote-buttons fade-in-on-create">
                <IconActionButton
                  busy={busyVote === 1 || (hasVote === 1 && busyVote === 0)}
                  title={hasVote === 1 ? 'Remove upvote' : 'Upvote this cat'}
                  selected={hasVote === 1}
                  icon="icon-thumbs-up"
                  iconSelected="icon-thumbs-up-alt"
                  onClick={() => addVote(image.id, hasVote === 1 ? 0 : 1)}
                />
                <span className="vote-count">{voteCount}</span>
                <IconActionButton
                  busy={busyVote === -1 || (hasVote === -1 && busyVote === 0)}
                  title={
                    hasVote === -1 ? 'Remove downvote' : 'Downvote this cat'
                  }
                  selected={hasVote === -1}
                  icon="icon-thumbs-down"
                  iconSelected="icon-thumbs-down-alt"
                  onClick={() => addVote(image.id, hasVote === -1 ? 0 : -1)}
                />
              </div>
            )}

            <img
              alt="image of a cat"
              src={image.url}
              width={image.width}
              height={image.height}
            />
          </li>
        )
      })}
    </ul>
  )
}

export default CatList

import CatList from '../Components/CatList'
import { useState } from 'react'
import { useCatStore } from '../Stores/CatStore'

const CATS_PER_PAGE = 24

function Home() {
  const [page, setPage] = useState(0)

  // show everyone's cats
  const catStore = useCatStore(undefined, page, CATS_PER_PAGE)
  // todo: there will be too many pages if [total_cats] % CATS_PER_PAGE === 0
  const showPager = page > 0 || catStore.data.length === CATS_PER_PAGE

  return (
    <div>
      {catStore.data.length > 0 && <CatList cats={catStore.data} />}
      {catStore.data.length === 0 && (
        <p className="text-center">no cats here</p>
      )}
      {showPager && (
        <div className="pager">
          <div role="group">
            <button onClick={() => setPage(page - 1)} disabled={page === 0}>
              &lt;
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={catStore.data.length < CATS_PER_PAGE}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

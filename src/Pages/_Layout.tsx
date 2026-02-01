import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router'
import Loading from '../Components/Loading'
import Login from '../Components/Login'
import { useSubStore } from '../Stores/SubStore'

export const Layout = () => {
  const subStore = useSubStore()
  

  return (
    <>
      <header>
        <div className="container">
          <div>
            <span className="icon-cat"></span>
            <span className="visible-sm-up"> Uptown Cat Ranking</span>
          </div>

          <nav>
            <NavLink to="/">
              <span className="icon-home" />
              home
            </NavLink>
            <NavLink to="/upload">
              <span className="icon-upload-cloud" />
              upload
            </NavLink>
            <button className="link" onClick={() => subStore.openDialog()}>
              {subStore.subId && <>
                <span className="icon-user"></span>
                <> [{subStore.subId}]</>
              </>}
              {!subStore.subId && <>
                <span className="icon-user-o"></span>
                <> login</>
              </>}
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>

      <Login />
    </>
  )
}

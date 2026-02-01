import { createBrowserRouter } from 'react-router'
import Home from './Pages/Home.tsx'
import Upload from './Pages/Upload.tsx'
import { Layout } from './Pages/_Layout.tsx'

export const ROUTES = {
  Home: '/',
  Upload: '/upload',
} as const

// don't really need fast-reload here and prefer to have the ROUTES in the same file
// eslint-disable-next-line react-refresh/only-export-components
export const router = createBrowserRouter([
  {
    element: (
      <>
        <Layout />
      </>
    ),
    children: [
      {
        path: ROUTES.Home,
        element: <Home />,
      },
      {
        path: ROUTES.Upload,
        element: <Upload />,
      },
    ],
  },
])

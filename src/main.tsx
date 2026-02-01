import './Styles/pico.scss'
import './Styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from './routes'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)

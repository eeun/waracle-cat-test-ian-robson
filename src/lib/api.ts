import { TheCatAPI } from '@thatapicompany/thecatapi'

export const theCatAPI = new TheCatAPI(import.meta.env.VITE_CAT_API_KEY, {
  host: import.meta.env.VITE_CAT_API_LOCATION,
})

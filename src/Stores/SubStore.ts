import { create } from 'zustand'

// the subId is stored in localstorage
// this assumes everyone uses a unique username and isn't worried about a password
const USER_KEY = 'user-sub-id'

interface SubStore {
  subId: string | null
  dialogIsOpen: boolean
  login: (subId: string, remember?: boolean) => void
  logout: () => void
  openDialog: (open?: boolean) => void
}

export const useSubStore = create<SubStore>((set) => ({
  subId: localStorage.getItem(USER_KEY) ?? null,
  dialogIsOpen: false,
  login(subId, remember = false) {
    if (remember) {
      localStorage.setItem(USER_KEY, subId)
    }
    return set({ subId })
  },
  logout() {
    localStorage.removeItem(USER_KEY)
    return set({ subId: null })
  },
  openDialog(open = true) {
    set({dialogIsOpen: open})
  },
}))

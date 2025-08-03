import { create } from 'zustand'

interface LoadingState {
  isLoading: boolean
  loadingMessage?: string
  isSyncPending: boolean
  isClearPending: boolean
  isRefetchPending: boolean
}

interface LoadingActions {
  setLoading: (loading: boolean, message?: string) => void
  setSyncPending: (pending: boolean) => void
  setClearPending: (pending: boolean) => void
  setRefetchPending: (pending: boolean) => void
  startSync: () => void
  startClear: () => void
  startRefetch: () => void
  resetAll: () => void
}

interface LoadingStore extends LoadingState, LoadingActions {}

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: undefined,
  isSyncPending: false,
  isClearPending: false,
  isRefetchPending: false,
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  ...initialState,

  setLoading: (isLoading, loadingMessage) => set({ isLoading, loadingMessage }),

  setSyncPending: (isSyncPending) => set({ isSyncPending }),

  setClearPending: (isClearPending) => set({ isClearPending }),

  setRefetchPending: (isRefetchPending) => set({ isRefetchPending }),

  startSync: () => set({
    isLoading: true,
    loadingMessage: 'Syncing transactions from emails...',
    isSyncPending: true
  }),

  startClear: () => set({
    isLoading: true,
    loadingMessage: 'Clearing all transactions...',
    isClearPending: true
  }),

  startRefetch: () => set({
    isLoading: true,
    loadingMessage: 'Refreshing data...',
    isRefetchPending: true
  }),

  resetAll: () => set(initialState),
}))
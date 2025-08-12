import { create } from "zustand";
import { LoadingTimeout, LoadingMessage } from "~/enums";

interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  isSyncPending: boolean;
  isClearPending: boolean;
  isRefetchPending: boolean;
}

interface LoadingActions {
  setLoading: (loading: boolean, message?: string) => void;
  setSyncPending: (pending: boolean) => void;
  setClearPending: (pending: boolean) => void;
  setRefetchPending: (pending: boolean) => void;
  startSync: () => void;
  startClear: () => void;
  startRefetch: () => void;
  startNavigation: () => void;
  startNavigationWithTimeout: (timeout?: number) => void;
  stopNavigation: () => void;
  resetAll: () => void;
}

interface LoadingStore extends LoadingState, LoadingActions {}

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: undefined,
  isSyncPending: false,
  isClearPending: false,
  isRefetchPending: false,
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  ...initialState,

  setLoading: (isLoading, loadingMessage) => set({ isLoading, loadingMessage }),

  setSyncPending: (isSyncPending) => set({ isSyncPending }),

  setClearPending: (isClearPending) => set({ isClearPending }),

  setRefetchPending: (isRefetchPending) => set({ isRefetchPending }),

  startSync: () =>
    set({
      isLoading: true,
      loadingMessage: LoadingMessage.SYNCING_TRANSACTIONS,
      isSyncPending: true,
    }),

  startClear: () =>
    set({
      isLoading: true,
      loadingMessage: LoadingMessage.CLEARING_TRANSACTIONS,
      isClearPending: true,
    }),

  startRefetch: () =>
    set({
      isLoading: true,
      loadingMessage: LoadingMessage.REFRESHING_DATA,
      isRefetchPending: true,
    }),

  startNavigation: () =>
    set({
      isLoading: true,
      loadingMessage: LoadingMessage.LOADING_PAGE,
    }),

  startNavigationWithTimeout: (
    timeout: number = LoadingTimeout.ROUTE_CHANGE,
  ) => {
    set({
      isLoading: true,
      loadingMessage: LoadingMessage.LOADING_PAGE,
    });

    // Auto-stop after timeout
    setTimeout(() => {
      set({
        isLoading: false,
        loadingMessage: undefined,
      });
    }, timeout);
  },

  stopNavigation: () =>
    set({
      isLoading: false,
      loadingMessage: undefined,
    }),

  resetAll: () => set(initialState),
}));

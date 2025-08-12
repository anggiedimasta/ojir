export enum LoadingTimeout {
  // Navigation loading timeouts
  ROUTE_CHANGE = 500, // ms - for pathname changes
  SEARCH_PARAMS = 400, // ms - for query parameter changes

  // Other loading timeouts
  MINIMUM_LOADING = 100, // ms - minimum time to show loading
  SYNC_OPERATION = 1000, // ms - for sync operations
  CLEAR_OPERATION = 800, // ms - for clear operations
  REFETCH_OPERATION = 600, // ms - for refetch operations
}

export enum LoadingMessage {
  // Navigation messages
  LOADING_PAGE = "Loading page...",
  LOADING_DATA = "Loading data...",

  // Operation messages
  SYNCING_TRANSACTIONS = "Syncing transactions from emails...",
  CLEARING_TRANSACTIONS = "Clearing all transactions...",
  REFRESHING_DATA = "Refreshing data...",

  // Generic messages
  PROCESSING = "Processing...",
  SAVING = "Saving...",
  UPDATING = "Updating...",
}

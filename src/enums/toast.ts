export enum ToastActionType {
  ADD_TOAST = "ADD_TOAST",
  UPDATE_TOAST = "UPDATE_TOAST",
  DISMISS_TOAST = "DISMISS_TOAST",
  REMOVE_TOAST = "REMOVE_TOAST",
}

export enum ToastLimit {
  DEFAULT = 1,
  MEDIUM = 3,
  HIGH = 5,
}

export enum ToastTimeout {
  REMOVE_DELAY = 1000000,
  SHORT = 3000,
  MEDIUM = 5000,
  LONG = 10000,
}

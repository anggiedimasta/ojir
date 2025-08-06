// Date utility functions
// TODO: Move date-related utilities here

export const createDateRange = (startDate: Date, endDate: Date) => {
  return { startDate, endDate };
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
  return date >= startDate && date <= endDate;
};
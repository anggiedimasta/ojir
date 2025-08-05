import { createTRPCRouter } from "../../../api/trpc";
import { calendarQueries } from "./queries";
import { calendarMutations } from "./mutations";

export const calendarRouter = createTRPCRouter({
  // Queries
  getByDateRange: calendarQueries.getByDateRange,

  // Mutations
  create: calendarMutations.create,
  update: calendarMutations.update,
  delete: calendarMutations.delete,
  shareEvent: calendarMutations.shareEvent,
});
import { createTRPCRouter } from "../../api/trpc";
import { walletRouter } from "./wallet/index";
import { calendarRouter } from "./calendar/index";
import { masterDataRouter } from "./master-data/index";

export const appRouter = createTRPCRouter({
  wallet: walletRouter,
  calendar: calendarRouter,
  masterData: masterDataRouter,
});

export type AppRouter = typeof appRouter;
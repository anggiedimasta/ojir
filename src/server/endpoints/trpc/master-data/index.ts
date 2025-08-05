import { createTRPCRouter } from "../../../api/trpc";
import { masterDataQueries } from "./queries";

export const masterDataRouter = createTRPCRouter({
  // Queries
  getBanks: masterDataQueries.getBanks,
  getPaymentMethods: masterDataQueries.getPaymentMethods,
});
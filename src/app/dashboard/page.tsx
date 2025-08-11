import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { DashboardContent } from "./_components/dashboard-content";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return <DashboardContent session={session} />;
}

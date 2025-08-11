import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="-left-32 absolute top-1/4 h-[28rem] w-[28rem] animate-float rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 opacity-10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-[32rem] w-[32rem] animate-float rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-10 blur-3xl delay-1000" />
        <div className="absolute right-1/4 bottom-1/4 h-[24rem] w-[24rem] animate-float rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-10 blur-3xl delay-2000" />
        <div className="absolute top-1/2 right-0 h-[36rem] w-[36rem] animate-float rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-10 blur-3xl delay-3000" />
        <div className="absolute bottom-1/3 left-1/3 h-[20rem] w-[20rem] animate-float rounded-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 opacity-10 blur-3xl delay-1500" />
        <div className="absolute top-2/3 right-1/4 h-[30rem] w-[30rem] animate-float rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-10 blur-3xl delay-2500" />
        <div className="absolute top-1/4 left-1/3 h-[40rem] w-[40rem] animate-float rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-10 blur-3xl delay-500" />
        <div className="absolute bottom-1/4 left-1/4 h-[35rem] w-[35rem] animate-float rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-10 blur-3xl delay-1750" />
        <div className="absolute top-3/4 left-1/2 h-[25rem] w-[25rem] animate-float rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 opacity-10 blur-3xl delay-2250" />
        <div className="absolute right-1/3 bottom-1/2 h-[45rem] w-[45rem] animate-float rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-10 blur-3xl delay-750" />
        <div className="absolute top-1/3 left-0 h-[38rem] w-[38rem] animate-float rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-10 blur-3xl delay-1250" />
        <div className="absolute right-0 bottom-0 h-[42rem] w-[42rem] animate-float rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-10 blur-3xl delay-2750" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <div className="relative">
          <Sidebar />
        </div>
        <div className="flex-1">
          <Navbar user={session.user} />

          <main className="mt-20">{children}</main>
        </div>
      </div>
    </div>
  );
}

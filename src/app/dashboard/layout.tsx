import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

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
    <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full opacity-10 blur-3xl animate-float delay-1000" />
        <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full opacity-10 blur-3xl animate-float delay-2000" />
        <div className="absolute top-1/2 right-0 w-[36rem] h-[36rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full opacity-10 blur-3xl animate-float delay-3000" />
        <div className="absolute bottom-1/3 left-1/3 w-[20rem] h-[20rem] bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full opacity-10 blur-3xl animate-float delay-1500" />
        <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full opacity-10 blur-3xl animate-float delay-2500" />
        <div className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full opacity-10 blur-3xl animate-float delay-500" />
        <div className="absolute bottom-1/4 left-1/4 w-[35rem] h-[35rem] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full opacity-10 blur-3xl animate-float delay-1750" />
        <div className="absolute top-3/4 left-1/2 w-[25rem] h-[25rem] bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-full opacity-10 blur-3xl animate-float delay-2250" />
        <div className="absolute bottom-1/2 right-1/3 w-[45rem] h-[45rem] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full opacity-10 blur-3xl animate-float delay-750" />
        <div className="absolute top-1/3 left-0 w-[38rem] h-[38rem] bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full opacity-10 blur-3xl animate-float delay-1250" />
        <div className="absolute bottom-0 right-0 w-[42rem] h-[42rem] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full opacity-10 blur-3xl animate-float delay-2750" />
      </div>

      <div className="flex min-h-screen relative z-10">
        <div className="relative">
          <Sidebar />
        </div>
        <div className="flex-1">
          <Navbar user={session.user} />

          <main className="mt-20">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
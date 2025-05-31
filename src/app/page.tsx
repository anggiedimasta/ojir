import Link from "next/link";
import { Navbar } from "~/components/ui/navbar";
import { Footer } from "~/components/ui/footer";
import { BarChart3, Target, Shield, ArrowRight, Calendar, Users, ChevronDown } from "lucide-react";
import { AnimatedSections } from "~/components/sections/animated-sections";
import { CountingStats } from "~/components/ui/counting-stats";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

const events = [
  {
    date: "Mar 15, 2024",
    time: "12:30 PM",
    title: "Team Lunch",
    description: "Team Lunch at Sushi Place",
    amount: "$156.80",
    category: "Food & Dining",
    status: "Approved",
    color: "bg-rose-500",
    media: "🍱"
  },
  {
    date: "Mar 15, 2024",
    time: "2:00 PM",
    title: "Office Supplies",
    description: "Office Supplies",
    amount: "$89.99",
    category: "Shopping",
    status: "Approved",
    color: "bg-emerald-500",
    media: "📦"
  },
  {
    date: "Mar 15, 2024",
    time: "4:30 PM",
    title: "Client Meeting",
    description: "Uber to Client Meeting",
    amount: "$32.50",
    category: "Transportation",
    status: "Pending",
    color: "bg-amber-500",
    media: "🚕"
  },
  {
    date: "Mar 15, 2024",
    time: "6:00 PM",
    title: "Conference Call",
    description: "Conference Call with Team",
    amount: "$0.00",
    category: "Business",
    status: "Approved",
    color: "bg-blue-500",
    media: "📞"
  }
];

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="relative min-h-screen bg-white text-slate-900 overflow-hidden">
        <Navbar />

        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full opacity-20 blur-3xl animate-float" />
          <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full opacity-20 blur-3xl animate-float delay-1000" />
          <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full opacity-20 blur-3xl animate-float delay-2000" />
          <div className="absolute top-1/2 right-0 w-[36rem] h-[36rem] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full opacity-20 blur-3xl animate-float delay-3000" />
          <div className="absolute bottom-1/3 left-1/3 w-[20rem] h-[20rem] bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full opacity-20 blur-3xl animate-float delay-1500" />
          <div className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full opacity-20 blur-3xl animate-float delay-2500" />
        </div>

        <main className="relative">
          {/* Hero Section */}
          <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight max-w-lg mx-auto lg:mx-0">
                    <div>Track your</div>
                    <div className="mt-2">expenses</div>
                    <div className="mt-2">
                      with{' '}
                      <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                        ease
                      </span>
                    </div>
                  </h1>
                  <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-lg mx-auto lg:mx-0">
                    Manage your finances effortlessly with our intuitive expense tracking app.
                    Get insights, set budgets, and achieve your financial goals.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href="/signin"
                      className="rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/features"
                      className="rounded-full bg-slate-100 px-8 py-3 text-base font-medium text-slate-900 hover:bg-slate-200 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>

                {/* Right Content - Dashboard Preview */}
                <div className="flex-1 relative lg:-mr-32">
                  {/* Mobile Calendar View */}
                  <div className="absolute -left-32 -top-12 w-80 z-10">
                    {/* iPhone Frame */}
                    <div className="relative backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl" style={{
                      background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2))',
                      boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      {/* Screen */}
                      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                        {/* Calendar Content */}
                        <div className="p-5">
                          {/* Navigation Actions */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 rounded-lg bg-slate-100/50 text-slate-600">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 rounded-lg bg-slate-100/50 text-slate-600">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                              </button>
                              <button className="p-1.5 rounded-lg bg-slate-100/50 text-slate-600">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </button>
                              <button className="p-1.5 rounded-lg bg-slate-100/50 text-slate-600">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Selected Day View */}
                          <div className="mb-4 flex items-center justify-center">
                            <button className="p-1.5 rounded-lg bg-slate-100/50 text-slate-600">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <div className="text-4xl font-bold text-slate-900 mx-4">15</div>
                            <button className="p-1.5 rounded-lg bg-slate-100/50 text-slate-600">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <div className="flex flex-col ml-4">
                              <div className="text-sm text-slate-500">March 2024</div>
                              <div className="text-sm text-slate-500">Friday</div>
                            </div>
                          </div>

                          {/* Events/Expenses List */}
                          <div className="space-y-4">
                            {events.map((event, i) => (
                              <div key={i} className="bg-slate-50/30 backdrop-blur-xl rounded-lg p-3" style={{
                                background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))',
                                boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                              }}>
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100/50 flex items-center justify-center text-xl">
                                    {event.media}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-slate-500">{event.time}</span>
                                      <span className="text-xs font-medium text-slate-900">{event.amount}</span>
                                    </div>
                                    <div className="text-sm font-medium text-slate-900">{event.title}</div>
                                    <div className="flex items-center justify-between mt-0.5">
                                      <span className="text-xs text-slate-500">{event.category}</span>
                                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                        event.status === "Approved"
                                          ? "bg-emerald-500/20 text-emerald-700"
                                          : "bg-amber-500/20 text-amber-700"
                                      }`}>
                                        {event.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Summary */}
                          <div className="mt-4 pt-3 border-t border-slate-200/50">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">Total Expenses</span>
                              <span className="font-bold bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
                                $524.29
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Home Indicator */}
                        <div className="h-1 w-20 bg-slate-200/50 backdrop-blur-xl rounded-full mx-auto mb-2" />
                      </div>
                    </div>
                  </div>

                  {/* Main Dashboard Preview */}
                  <div className="relative bg-transparent backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden mt-16 w-[calc(100%+16rem)]">
                    {/* Mock Dashboard Header */}
                    <div className="p-4 border-b border-slate-200/50 flex items-center justify-between backdrop-blur-xl" style={{
                      background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
                      boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div className="flex items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-rose-500" />
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        </div>
                        <div className="text-sm text-slate-500 ml-[150px]">Expenses Record</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                      </div>
                    </div>

                    {/* Mock Dashboard Content */}
                    <div className="flex">
                      {/* Sidebar */}
                      <div className="w-[200px] border-r border-slate-200/50 backdrop-blur-xl" style={{
                        background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
                        boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        {/* Sidebar content will go here */}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 p-6 backdrop-blur-xl" style={{
                        background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
                        boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div className="grid grid-cols-1 gap-6">
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              { label: "Total Expenses", value: "$524.29", color: "from-rose-500 to-rose-400" },
                              { label: "Pending Approval", value: "$32.50", color: "from-amber-500 to-amber-400" },
                              { label: "Approved", value: "$491.79", color: "from-emerald-500 to-emerald-400" }
                            ].map((stat, i) => (
                              <div key={i} className="bg-slate-50/50 backdrop-blur-xl rounded-xl p-4" style={{
                                background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5))',
                                boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                              }}>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                                <div className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                  {stat.value}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Mock Expense Table */}
                          <div className="bg-slate-50/50 backdrop-blur-xl rounded-xl p-4" style={{
                            background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5))',
                            boxShadow: '0 4px 24px -1px rgba(0, 0, 0, 0.1)'
                          }}>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Description</th>
                                    <th className="pb-3 font-medium">Category</th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="text-sm">
                                  {events.map((expense, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0">
                                      <td className="py-3 text-slate-600">{expense.date}</td>
                                      <td className="py-3 font-medium text-slate-900">{expense.description}</td>
                                      <td className="py-3 text-slate-600">{expense.category}</td>
                                      <td className="py-3 font-medium text-slate-900">{expense.amount}</td>
                                      <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          expense.status === "Approved"
                                            ? "bg-emerald-500/20 text-emerald-700"
                                            : "bg-amber-500/20 text-amber-700"
                                        }`}>
                                          {expense.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-100/50">
            <div className="max-w-7xl mx-auto">
              <div className="text-3xl font-bold text-center mb-12">
                Why choose Ojir?
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl transform transition-transform group-hover:scale-105" />
                    <div className="relative p-6 rounded-2xl bg-white hover:bg-slate-50 transition-colors border border-slate-100">
                      <div className="text-3xl mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600">{feature.description}</p>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-24 px-8 md:px-16 lg:px-24 bg-slate-100/50">
            <CountingStats />
          </section>

          {/* Features Section with Cards */}
          <section className="py-24 px-8 md:px-16 lg:px-24 bg-slate-100/50">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-6xl mx-auto">
              {[
                {
                  title: "Smart Expense Tracking",
                  description: "Track your expenses with ease. Add receipts, categorize spending, and get insights into your financial habits with AI-powered analysis.",
                  color: "#FF8C00",
                  icon: <BarChart3 className="w-8 h-8" />
                },
                {
                  title: "Event & Location Management",
                  description: "Record expenses with location data, event details, and media documentation. Perfect for travel, business trips, and special occasions.",
                  color: "#4ECDC4",
                  icon: <Calendar className="w-8 h-8" />
                },
                {
                  title: "Collaborative Features",
                  description: "Share expenses with friends, family, or colleagues. Tag users, split bills, and manage group expenses effortlessly.",
                  color: "#FF69B4",
                  icon: <Users className="w-8 h-8" />
                },
                {
                  title: "Calendar Integration",
                  description: "View your expenses and events in a unified calendar. Track spending patterns, upcoming events, and manage your financial timeline.",
                  color: "#9B59B6",
                  icon: <Calendar className="w-8 h-8" />
                }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative h-full"
                >
                  <div
                    className="flex flex-col h-full rounded-xl p-6 bg-white border hover:shadow-xl transition-all duration-300"
                    style={{
                      borderColor: `${feature.color}30`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{
                        background: `${feature.color}15`,
                        color: feature.color
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: feature.color }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 flex-grow">{feature.description}</p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5" style={{ color: feature.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section with Cards */}
          <section className="py-24 px-8 md:px-16 lg:px-24 bg-slate-100/50">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  quote: "Ojir has completely transformed how I manage my expenses. The calendar integration is a game-changer!",
                  name: "Sarah Johnson",
                  role: "Business Owner",
                  color: "#FF8C00"
                },
                {
                  quote: "The collaborative features make it so easy to split expenses with my team. Highly recommended!",
                  name: "Mike Chen",
                  role: "Project Manager",
                  color: "#4ECDC4"
                }
              ].map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="p-6 rounded-xl bg-white hover:bg-slate-50 transition-colors"
                >
                  <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ background: testimonial.color }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 px-8 md:px-16 lg:px-24 text-center bg-slate-100/50">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Get Started?</h2>
              <p className="text-gray-600 mb-8">Join thousands of users who are already managing their expenses smarter.</p>
              <Link
                href="/signin"
                className="inline-block rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] px-10 py-3 font-semibold text-white no-underline transition hover:opacity-90 hover:scale-105"
              >
                Start Free Trial
              </Link>
            </div>
          </section>

          {/* Animated Sections */}
          <AnimatedSections />
        </main>

        <Footer />
      </div>
    </HydrateClient>
  );
}

const features = [
  {
    icon: <BarChart3 className="w-8 h-8 text-emerald-500" />,
    title: 'Smart Analytics',
    description: 'Get detailed insights into your spending patterns with beautiful charts and reports.',
  },
  {
    icon: <Target className="w-8 h-8 text-emerald-500" />,
    title: 'Budget Planning',
    description: 'Set and track your budgets with ease. Stay on top of your financial goals.',
  },
  {
    icon: <Shield className="w-8 h-8 text-emerald-500" />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We take your privacy seriously.',
  },
];

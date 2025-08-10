import {
  ArrowRight,
  BarChart3,
  Calendar,
  ChevronDown,
  Shield,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AnimatedSections } from "~/components/sections/animated-sections";
import { CountingStats } from "~/components/ui/counting-stats";
import { Footer } from "~/components/ui/footer";
import { Navbar } from "~/components/ui/navbar";

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
    media: "🍱",
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
    media: "📦",
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
    media: "🚕",
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
    media: "📞",
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
        <Navbar />

        {/* Background Elements */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="-left-32 absolute top-1/4 h-[28rem] w-[28rem] animate-float rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 opacity-20 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 h-[32rem] w-[32rem] animate-float rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-20 blur-3xl delay-1000" />
          <div className="absolute right-1/4 bottom-1/4 h-[24rem] w-[24rem] animate-float rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-20 blur-3xl delay-2000" />
          <div className="absolute top-1/2 right-0 h-[36rem] w-[36rem] animate-float rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-20 blur-3xl delay-3000" />
          <div className="absolute bottom-1/3 left-1/3 h-[20rem] w-[20rem] animate-float rounded-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 opacity-20 blur-3xl delay-1500" />
          <div className="absolute top-2/3 right-1/4 h-[30rem] w-[30rem] animate-float rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-20 blur-3xl delay-2500" />
        </div>

        <main className="relative">
          {/* Hero Section */}
          <section className="relative px-4 pt-40 pb-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center gap-12 lg:flex-row">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="mx-auto max-w-lg font-bold text-6xl tracking-tight sm:text-7xl md:text-8xl lg:mx-0">
                    <div>Track your</div>
                    <div className="mt-2">expenses</div>
                    <div className="mt-2">
                      with{" "}
                      <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                        ease
                      </span>
                    </div>
                  </h1>
                  <p className="mx-auto mt-6 max-w-lg text-lg text-slate-600 sm:text-xl lg:mx-0">
                    Manage your finances effortlessly with our intuitive expense
                    tracking app. Get insights, set budgets, and achieve your
                    financial goals.
                  </p>
                  <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                    <Link
                      href="/signin"
                      className="rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-8 py-3 font-medium text-base text-white transition-opacity hover:opacity-90"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/features"
                      className="rounded-full bg-slate-100 px-8 py-3 font-medium text-base text-slate-900 transition-colors hover:bg-slate-200"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>

                {/* Right Content - Dashboard Preview */}
                <div className="lg:-mr-32 relative flex-1">
                  {/* Mobile Calendar View */}
                  <div className="-left-32 -top-12 absolute z-10 w-80">
                    {/* iPhone Frame */}
                    <div
                      className="relative rounded-[2.5rem] p-1 shadow-2xl backdrop-blur-xl"
                      style={{
                        background:
                          "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.2))",
                        boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {/* Screen */}
                      <div className="overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-xl">
                        {/* Calendar Content */}
                        <div className="p-5">
                          {/* Navigation Actions */}
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="rounded-lg bg-slate-100/50 p-1.5 text-slate-600"
                              >
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  role="img"
                                  aria-label="Previous"
                                >
                                  <title>Previous</title>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="rounded-lg bg-slate-100/50 p-1.5 text-slate-600"
                              >
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  role="img"
                                  aria-label="Sort"
                                >
                                  <title>Sort</title>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="rounded-lg bg-slate-100/50 p-1.5 text-slate-600"
                              >
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  role="img"
                                  aria-label="Search"
                                >
                                  <title>Search</title>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="rounded-lg bg-slate-100/50 p-1.5 text-slate-600"
                              >
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  role="img"
                                  aria-label="Share"
                                >
                                  <title>Share</title>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Selected Day View */}
                          <div className="mb-4 flex items-center justify-center">
                            <button
                              type="button"
                              className="rounded-lg bg-slate-100/50 p-1.5 text-slate-600"
                            >
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                role="img"
                                aria-label="Previous day"
                              >
                                <title>Previous day</title>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </button>
                            <div className="mx-4 font-bold text-4xl text-slate-900">
                              15
                            </div>
                            <button
                              type="button"
                              className="rounded-lg bg-slate-100/50 p-1.5 text-slate-600"
                            >
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                role="img"
                                aria-label="Next day"
                              >
                                <title>Next day</title>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                            <div className="ml-4 flex flex-col">
                              <div className="text-slate-500 text-sm">
                                March 2024
                              </div>
                              <div className="text-slate-500 text-sm">
                                Friday
                              </div>
                            </div>
                          </div>

                          {/* Events/Expenses List */}
                          <div className="space-y-4">
                            {events.map((event, i) => (
                              <div
                                key={`event-${event.title}-${i}`}
                                className="rounded-lg bg-slate-50/30 p-3 backdrop-blur-xl"
                                style={{
                                  background:
                                    "linear-gradient(to bottom right, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))",
                                  boxShadow:
                                    "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100/50 text-xl">
                                    {event.media}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-slate-500 text-xs">
                                        {event.time}
                                      </span>
                                      <span className="font-medium text-slate-900 text-xs">
                                        {event.amount}
                                      </span>
                                    </div>
                                    <div className="font-medium text-slate-900 text-sm">
                                      {event.title}
                                    </div>
                                    <div className="mt-0.5 flex items-center justify-between">
                                      <span className="text-slate-500 text-xs">
                                        {event.category}
                                      </span>
                                      <span
                                        className={`rounded-full px-1.5 py-0.5 text-xs ${
                                          event.status === "Approved"
                                            ? "bg-emerald-500/20 text-emerald-700"
                                            : "bg-amber-500/20 text-amber-700"
                                        }`}
                                      >
                                        {event.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Summary */}
                          <div className="mt-4 border-slate-200/50 border-t pt-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">
                                Total Expenses
                              </span>
                              <span className="bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text font-bold text-transparent">
                                $524.29
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Home Indicator */}
                        <div className="mx-auto mb-2 h-1 w-20 rounded-full bg-slate-200/50 backdrop-blur-xl" />
                      </div>
                    </div>
                  </div>

                  {/* Main Dashboard Preview */}
                  <div className="relative mt-16 w-[calc(100%+16rem)] overflow-hidden rounded-2xl border border-slate-200/50 bg-transparent shadow-2xl backdrop-blur-xl">
                    {/* Mock Dashboard Header */}
                    <div
                      className="flex items-center justify-between border-slate-200/50 border-b p-4 backdrop-blur-xl"
                      style={{
                        background:
                          "linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))",
                        boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="flex items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-rose-500" />
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        </div>
                        <div className="ml-[150px] text-slate-500 text-sm">
                          Expenses Record
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-slate-300" />
                        <div className="h-3 w-3 rounded-full bg-slate-300" />
                        <div className="h-3 w-3 rounded-full bg-slate-300" />
                      </div>
                    </div>

                    {/* Mock Dashboard Content */}
                    <div className="flex">
                      {/* Sidebar */}
                      <div
                        className="w-[200px] border-slate-200/50 border-r backdrop-blur-xl"
                        style={{
                          background:
                            "linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))",
                          boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Sidebar content will go here */}
                      </div>

                      {/* Main Content */}
                      <div
                        className="flex-1 p-6 backdrop-blur-xl"
                        style={{
                          background:
                            "linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))",
                          boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="grid grid-cols-1 gap-6">
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {[
                              {
                                label: "Total Expenses",
                                value: "$524.29",
                                color: "from-rose-500 to-rose-400",
                              },
                              {
                                label: "Pending Approval",
                                value: "$32.50",
                                color: "from-amber-500 to-amber-400",
                              },
                              {
                                label: "Approved",
                                value: "$491.79",
                                color: "from-emerald-500 to-emerald-400",
                              },
                            ].map((stat, i) => (
                              <div
                                key={`stat-${stat.label}-${i}`}
                                className="rounded-xl bg-slate-50/50 p-4 backdrop-blur-xl"
                                style={{
                                  background:
                                    "linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5))",
                                  boxShadow:
                                    "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div className="text-slate-500 text-sm">
                                  {stat.label}
                                </div>
                                <div
                                  className={`bg-gradient-to-r font-bold text-xl ${stat.color} bg-clip-text text-transparent`}
                                >
                                  {stat.value}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Mock Expense Table */}
                          <div
                            className="rounded-xl bg-slate-50/50 p-4 backdrop-blur-xl"
                            style={{
                              background:
                                "linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5))",
                              boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-slate-200 border-b text-left text-slate-500 text-sm">
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">
                                      Description
                                    </th>
                                    <th className="pb-3 font-medium">
                                      Category
                                    </th>
                                    <th className="pb-3 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="text-sm">
                                  {events.map((expense, i) => (
                                    <tr
                                      key={`expense-${expense.title}-${i}`}
                                      className="border-slate-100 border-b last:border-0"
                                    >
                                      <td className="py-3 text-slate-600">
                                        {expense.date}
                                      </td>
                                      <td className="py-3 font-medium text-slate-900">
                                        {expense.description}
                                      </td>
                                      <td className="py-3 text-slate-600">
                                        {expense.category}
                                      </td>
                                      <td className="py-3 font-medium text-slate-900">
                                        {expense.amount}
                                      </td>
                                      <td className="py-3">
                                        <span
                                          className={`rounded-full px-2 py-1 font-medium text-xs ${
                                            expense.status === "Approved"
                                              ? "bg-emerald-500/20 text-emerald-700"
                                              : "bg-amber-500/20 text-amber-700"
                                          }`}
                                        >
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
          <section className="bg-slate-100/50 px-4 pt-16 pb-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center font-bold text-3xl">
                Why choose Ojir?
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {features.map((feature, index) => (
                  <div key={feature.title} className="group relative">
                    <div className="absolute inset-0 transform rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent transition-transform group-hover:scale-105" />
                    <div className="relative rounded-2xl border border-slate-100 bg-white p-6 transition-colors hover:bg-slate-50">
                      <div className="mb-4 text-3xl">{feature.icon}</div>
                      <h3 className="mb-2 font-semibold text-xl">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600">{feature.description}</p>
                      <div className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <ArrowRight className="h-5 w-5 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-slate-100/50 px-8 py-24 md:px-16 lg:px-24">
            <CountingStats />
          </section>

          {/* Features Section with Cards */}
          <section className="bg-slate-100/50 px-8 py-24 md:px-16 lg:px-24">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2">
              {[
                {
                  title: "Smart Expense Tracking",
                  description:
                    "Track your expenses with ease. Add receipts, categorize spending, and get insights into your financial habits with AI-powered analysis.",
                  color: "#FF8C00",
                  icon: <BarChart3 className="h-8 w-8" />,
                },
                {
                  title: "Event & Location Management",
                  description:
                    "Record expenses with location data, event details, and media documentation. Perfect for travel, business trips, and special occasions.",
                  color: "#4ECDC4",
                  icon: <Calendar className="h-8 w-8" />,
                },
                {
                  title: "Collaborative Features",
                  description:
                    "Share expenses with friends, family, or colleagues. Tag users, split bills, and manage group expenses effortlessly.",
                  color: "#FF69B4",
                  icon: <Users className="h-8 w-8" />,
                },
                {
                  title: "Calendar Integration",
                  description:
                    "View your expenses and events in a unified calendar. Track spending patterns, upcoming events, and manage your financial timeline.",
                  color: "#9B59B6",
                  icon: <Calendar className="h-8 w-8" />,
                },
              ].map((feature, index) => (
                <div key={feature.title} className="group relative h-full">
                  <div
                    className="flex h-full flex-col rounded-xl border bg-white p-6 transition-all duration-300 hover:shadow-xl"
                    style={{
                      borderColor: `${feature.color}30`,
                    }}
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        background: `${feature.color}15`,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3
                      className="mb-3 font-bold text-2xl"
                      style={{ color: feature.color }}
                    >
                      {feature.title}
                    </h3>
                    <p className="flex-grow text-gray-600">
                      {feature.description}
                    </p>
                    <div className="mt-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowRight
                        className="h-5 w-5"
                        style={{ color: feature.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section with Cards */}
          <section className="bg-slate-100/50 px-8 py-24 md:px-16 lg:px-24">
            <h2 className="mb-12 text-center font-bold text-3xl text-gray-900">
              What Our Users Say
            </h2>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  quote:
                    "Ojir has completely transformed how I manage my expenses. The calendar integration is a game-changer!",
                  name: "Sarah Johnson",
                  role: "Business Owner",
                  color: "#FF8C00",
                },
                {
                  quote:
                    "The collaborative features make it so easy to split expenses with my team. Highly recommended!",
                  name: "Mike Chen",
                  role: "Project Manager",
                  color: "#4ECDC4",
                },
              ].map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="rounded-xl bg-white p-6 transition-colors hover:bg-slate-50"
                >
                  <p className="mb-4 text-gray-600">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full"
                      style={{ background: testimonial.color }}
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-slate-100/50 px-8 py-24 text-center md:px-16 lg:px-24">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 font-bold text-3xl text-gray-900">
                Ready to Get Started?
              </h2>
              <p className="mb-8 text-gray-600">
                Join thousands of users who are already managing their expenses
                smarter.
              </p>
              <Link
                href="/signin"
                className="inline-block rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] px-10 py-3 font-semibold text-white no-underline transition hover:scale-105 hover:opacity-90"
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
    icon: <BarChart3 className="h-8 w-8 text-emerald-500" />,
    title: "Smart Analytics",
    description:
      "Get detailed insights into your spending patterns with beautiful charts and reports.",
  },
  {
    icon: <Target className="h-8 w-8 text-emerald-500" />,
    title: "Budget Planning",
    description:
      "Set and track your budgets with ease. Stay on top of your financial goals.",
  },
  {
    icon: <Shield className="h-8 w-8 text-emerald-500" />,
    title: "Secure & Private",
    description:
      "Your data is encrypted and secure. We take your privacy seriously.",
  },
];

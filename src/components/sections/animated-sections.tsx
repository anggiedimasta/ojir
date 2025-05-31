'use client';

import Link from "next/link";
import { Play, ArrowRight, BarChart3, Target, Shield, Zap, Briefcase, MessageSquare, Mail, Users, Calendar, CreditCard } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function AnimatedSections() {
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <>
      {/* Video Demo Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-slate-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900">See Ojir in Action</h2>
              <p className="text-lg text-gray-600">
                Watch how Ojir transforms expense management with its intuitive interface and powerful features.
                From tracking daily expenses to managing team budgets, see how easy it can be.
              </p>
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white no-underline transition hover:opacity-90"
                  >
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href="/features"
                    className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-600"
                  >
                    Explore Features
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              ref={videoRef}
              style={{ scale, opacity }}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Ojir Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-slate-100/50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-16 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Track Expenses",
                description: "Easily record your expenses with photos, receipts, and location data.",
                icon: <CreditCard className="w-8 h-8 text-emerald-500" />
              },
              {
                title: "Analyze Patterns",
                description: "Get insights into your spending habits with AI-powered analytics.",
                icon: <BarChart3 className="w-8 h-8 text-emerald-500" />
              },
              {
                title: "Share & Collaborate",
                description: "Split expenses with friends and manage team budgets together.",
                icon: <Users className="w-8 h-8 text-emerald-500" />
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                  <div className="relative p-6 h-full flex flex-col justify-end">
                    <div className="mb-4">{step.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <motion.div
                  className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {index + 1}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-slate-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900">Seamless Integrations</h2>
              <p className="text-lg text-gray-600">
                Connect Ojir with your favorite tools and services. From accounting software to payment platforms,
                we make it easy to keep everything in sync.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "QuickBooks", icon: <Briefcase className="w-8 h-8 text-emerald-500" /> },
                  { name: "Stripe", icon: <CreditCard className="w-8 h-8 text-emerald-500" /> },
                  { name: "Slack", icon: <MessageSquare className="w-8 h-8 text-emerald-500" /> },
                  { name: "Google", icon: <Mail className="w-8 h-8 text-emerald-500" /> },
                  { name: "Microsoft", icon: <Calendar className="w-8 h-8 text-emerald-500" /> },
                  { name: "Zapier", icon: <Zap className="w-8 h-8 text-emerald-500" /> }
                ].map((integration) => (
                  <motion.div
                    key={integration.name}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square rounded-xl bg-white p-4 flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    {integration.icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl" />
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center gap-4">
                      <Briefcase className="w-12 h-12 text-emerald-500" />
                      <CreditCard className="w-12 h-12 text-emerald-500" />
                      <MessageSquare className="w-12 h-12 text-emerald-500" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">Connect Your Tools</p>
                    <p className="text-gray-600">Seamlessly integrate with your favorite services</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-slate-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.h2
              className="text-4xl font-bold text-gray-900"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Start Managing Your Expenses Today
            </motion.h2>
            <p className="text-xl text-gray-600">
              Join thousands of users who are already saving time and money with Ojir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signin"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 font-semibold text-white no-underline transition hover:opacity-90"
                >
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-gray-900 no-underline transition hover:bg-slate-50"
                >
                  Contact Sales
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
	ArrowRight,
	BarChart3,
	Briefcase,
	Calendar,
	CreditCard,
	Mail,
	MessageSquare,
	Play,
	Shield,
	Target,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function AnimatedSections() {
	const videoRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: videoRef,
		offset: ["start end", "end start"],
	});
	const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
	const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

	return (
		<>
			{/* Video Demo Section */}
			<section className="bg-slate-100/50 px-8 py-24 md:px-16 lg:px-24">
				<div className="mx-auto max-w-7xl">
					<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
						<motion.div
							className="space-y-6"
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
						>
							<h2 className="font-bold text-3xl text-gray-900">
								See Ojir in Action
							</h2>
							<p className="text-gray-600 text-lg">
								Watch how Ojir transforms expense management with its intuitive
								interface and powerful features. From tracking daily expenses to
								managing team budgets, see how easy it can be.
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
										<Play className="h-4 w-4" />
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
										<ArrowRight className="h-4 w-4" />
									</Link>
								</motion.div>
							</div>
						</motion.div>
						<motion.div
							ref={videoRef}
							style={{ scale, opacity }}
							className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl"
						>
							<iframe
								className="absolute inset-0 h-full w-full"
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
			<section className="bg-slate-100/50 px-8 py-24 md:px-16 lg:px-24">
				<div className="mx-auto max-w-7xl">
					<motion.h2
						className="mb-16 text-center font-bold text-3xl text-gray-900"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
					>
						How It Works
					</motion.h2>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						{[
							{
								title: "Track Expenses",
								description:
									"Easily record your expenses with photos, receipts, and location data.",
								icon: <CreditCard className="h-8 w-8 text-emerald-500" />,
							},
							{
								title: "Analyze Patterns",
								description:
									"Get insights into your spending habits with AI-powered analytics.",
								icon: <BarChart3 className="h-8 w-8 text-emerald-500" />,
							},
							{
								title: "Share & Collaborate",
								description:
									"Split expenses with friends and manage team budgets together.",
								icon: <Users className="h-8 w-8 text-emerald-500" />,
							},
						].map((step, index) => (
							<motion.div
								key={step.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.2 }}
								viewport={{ once: true }}
								whileHover={{ y: -5 }}
								className="group relative"
							>
								<div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl">
									<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
									<div className="relative flex h-full flex-col justify-end p-6">
										<div className="mb-4">{step.icon}</div>
										<h3 className="mb-2 font-semibold text-gray-900 text-xl">
											{step.title}
										</h3>
										<p className="text-gray-600">{step.description}</p>
									</div>
								</div>
								<motion.div
									className="-top-4 -left-4 absolute flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 font-bold text-white"
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
			<section className="bg-slate-100/50 px-8 py-24 md:px-16 lg:px-24">
				<div className="mx-auto max-w-7xl">
					<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
						<motion.div
							className="space-y-6"
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
						>
							<h2 className="font-bold text-3xl text-gray-900">
								Seamless Integrations
							</h2>
							<p className="text-gray-600 text-lg">
								Connect Ojir with your favorite tools and services. From
								accounting software to payment platforms, we make it easy to
								keep everything in sync.
							</p>
							<div className="grid grid-cols-3 gap-4">
								{[
									{
										name: "QuickBooks",
										icon: <Briefcase className="h-8 w-8 text-emerald-500" />,
									},
									{
										name: "Stripe",
										icon: <CreditCard className="h-8 w-8 text-emerald-500" />,
									},
									{
										name: "Slack",
										icon: (
											<MessageSquare className="h-8 w-8 text-emerald-500" />
										),
									},
									{
										name: "Google",
										icon: <Mail className="h-8 w-8 text-emerald-500" />,
									},
									{
										name: "Microsoft",
										icon: <Calendar className="h-8 w-8 text-emerald-500" />,
									},
									{
										name: "Zapier",
										icon: <Zap className="h-8 w-8 text-emerald-500" />,
									},
								].map((integration) => (
									<motion.div
										key={integration.name}
										whileHover={{ scale: 1.1, rotate: 5 }}
										whileTap={{ scale: 0.95 }}
										className="flex aspect-square items-center justify-center rounded-xl bg-white p-4 transition-shadow hover:shadow-lg"
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
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent" />
							<motion.div
								className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-xl"
								whileHover={{ scale: 1.02 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="space-y-4 text-center">
										<div className="flex justify-center gap-4">
											<Briefcase className="h-12 w-12 text-emerald-500" />
											<CreditCard className="h-12 w-12 text-emerald-500" />
											<MessageSquare className="h-12 w-12 text-emerald-500" />
										</div>
										<p className="font-semibold text-gray-900 text-lg">
											Connect Your Tools
										</p>
										<p className="text-gray-600">
											Seamlessly integrate with your favorite services
										</p>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className="bg-slate-100/50 px-8 py-24 md:px-16 lg:px-24">
				<div className="mx-auto max-w-4xl text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="space-y-6"
					>
						<motion.h2
							className="font-bold text-4xl text-gray-900"
							whileHover={{ scale: 1.02 }}
							transition={{ type: "spring", stiffness: 300 }}
						>
							Start Managing Your Expenses Today
						</motion.h2>
						<p className="text-gray-600 text-xl">
							Join thousands of users who are already saving time and money with
							Ojir.
						</p>
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
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

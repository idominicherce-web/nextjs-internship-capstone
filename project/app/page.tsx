import { auth } from "@clerk/nextjs/server";
import {
	ArrowRight,
	BarChart3,
	Calendar as CalendarIcon,
	Kanban,
	LayoutDashboard,
	Scroll,
	Users,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/common/header";
import { getOrCreateDbUser } from "@/lib/auth";

export default async function HomePage() {
	// Sync authenticated user into Neon DB if session exists upon landing
	const { userId } = await auth();
	if (userId) {
		await getOrCreateDbUser();
	}

	return (
		<div className="relative flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-[#1A120C] font-serif select-none text-[#F8EED5] antialiased">
			{/* Reusable Header */}
			<Header />

			{/* HTML5 Main Landmark */}
			<main className="flex-1">
				{/* Compact Hero Section */}
				<section className="relative z-10 flex flex-col items-center px-3 py-6 text-center sm:px-6 sm:py-12 lg:px-8">
					{/* Background Glow */}
					<div className="pointer-events-none absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full bg-radial from-[#D4A74A]/20 via-orange-600/10 to-transparent blur-3xl sm:h-80 sm:w-80" />

					<div className="container relative z-10 mx-auto max-w-4xl min-w-0">
						{/* Top Divider */}
						<div className="mb-2 flex items-center justify-center gap-2 text-xs text-[#D4A74A] opacity-90 select-none sm:mb-3 sm:text-sm">
							<span>✦</span>
							<div className="h-px w-10 bg-gradient-to-r from-transparent via-[#D4A74A]/60 to-transparent sm:w-16" />
							<span>⚔</span>
							<div className="h-px w-10 bg-gradient-to-r from-transparent via-[#D4A74A]/60 to-transparent sm:w-16" />
							<span>✦</span>
						</div>

						{/* Title Header */}
						<header className="mb-5 min-w-0 sm:mb-6">
							<h1 className="flex flex-col items-center justify-center font-black tracking-wider uppercase drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
								<span className="mb-1 text-xs font-bold tracking-[0.3em] text-[#D7B05C] sm:text-xl sm:tracking-[0.4em]">
									THE
								</span>
								<span className="w-full bg-gradient-to-b from-[#FFF5D6] via-[#D4A74A] to-[#8F6236] bg-clip-text text-3xl font-black tracking-normal text-transparent filter drop-shadow-[0_0_20px_rgba(212,167,74,0.3)] sm:text-6xl sm:tracking-[0.18em] sm:pl-[0.18em] md:text-7xl">
									ROUNDTABLE
								</span>
							</h1>

							<p className="mt-2 font-sans text-[10px] font-extrabold uppercase tracking-widest text-[#D7B05C] sm:mt-3 sm:text-xs sm:tracking-[0.3em]">
								Agile Task Management • Guild Team Collaboration • Project
								Workflows
							</p>
						</header>

						{/* Divider */}
						<div className="my-3 flex items-center justify-center gap-2 text-xs text-[#8F6236] sm:my-4">
							<span>⚜</span>
							<div className="h-px w-20 bg-gradient-to-r from-transparent via-[#8F6236] to-transparent sm:w-32" />
							<span>⚜</span>
						</div>

						{/* HERO PARCHMENT CONTRACT */}
						<div className="relative z-10 mx-auto mb-8 w-full max-w-2xl min-w-0 sm:mb-10">
							<div className="relative rounded-sm border-2 border-[#3B2415] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] p-2 shadow-[0_15px_40px_rgba(0,0,0,0.9)] sm:border-4 sm:p-3">
								<div className="absolute left-1 top-1 z-30 h-3 w-3 rounded-xs border border-black bg-gradient-to-br from-zinc-600 to-zinc-900 sm:h-3.5 sm:w-3.5" />
								<div className="absolute right-1 top-1 z-30 h-3 w-3 rounded-xs border border-black bg-gradient-to-br from-zinc-600 to-zinc-900 sm:h-3.5 sm:w-3.5" />
								<div className="absolute bottom-1 left-1 z-30 h-3 w-3 rounded-xs border border-black bg-gradient-to-br from-zinc-600 to-zinc-900 sm:h-3.5 sm:w-3.5" />
								<div className="absolute bottom-1 right-1 z-30 h-3 w-3 rounded-xs border border-black bg-gradient-to-br from-zinc-600 to-zinc-900 sm:h-3.5 sm:w-3.5" />

								<div
									className="relative z-20 rounded-xs border border-[#8F6236]/60 px-4 py-5 shadow-inner sm:border-2 sm:px-8 sm:py-6"
									style={{
										backgroundColor: "#F3E5C3",
										backgroundImage: `
                      repeating-linear-gradient(
                        0deg,
                        rgba(0,0,0,0.03),
                        rgba(0,0,0,0.03) 1px,
                        transparent 1px,
                        transparent 10px
                      )
                    `,
									}}
								>
									<div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_25px_rgba(59,36,21,0.5)] mix-blend-multiply" />

									<p className="relative z-40 mb-2 font-serif italic text-sm font-black leading-relaxed text-[#1A120C] sm:text-lg">
										Plan projects, organize tasks, track milestones, and keep
										your team aligned from one command center.
									</p>
									<p className="relative z-40 mb-5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B3922] sm:mb-6 sm:text-xs">
										The command board for modern project teams.
									</p>

									<div className="relative z-40 flex flex-col justify-center gap-2.5 sm:flex-row sm:gap-4">
										<Link
											href="/dashboard"
											className="group relative inline-flex items-center justify-center rounded-xs border-2 border-[#D4A74A] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] px-5 py-3 font-sans text-[11px] font-black uppercase tracking-wider text-[#F3E5C3] shadow-md transition-all active:scale-[0.99] sm:px-8 sm:py-3.5 sm:text-xs sm:tracking-[0.2em]"
										>
											<span className="flex items-center gap-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">
												Open Dashboard
												<ArrowRight
													className="text-[#D4A74A] transition-transform group-hover:translate-x-1"
													size={14}
												/>
											</span>
										</Link>

										<Link
											href="/projects"
											className="inline-flex items-center justify-center rounded-xs border-2 border-[#8F6236] bg-[#E3D2A8] px-5 py-3 font-sans text-[11px] font-black uppercase tracking-wider text-[#1A120C] shadow-sm transition-all hover:bg-[#D8C393] active:scale-[0.99] sm:px-8 sm:py-3.5 sm:text-xs sm:tracking-[0.2em]"
										>
											View Projects
										</Link>
									</div>
								</div>
							</div>
						</div>

						{/* FEATURE CARDS */}
						<div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-3 sm:mb-12 sm:gap-5 md:grid-cols-3">
							<div className="relative flex flex-col items-center justify-center rounded-xs border border-[#8F6236]/60 bg-gradient-to-b from-[#3B2415] to-[#1A120C] p-4 shadow-xl">
								<div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#D4A74A] bg-gradient-to-br from-[#8F6236] via-[#5B3922] to-[#1A120C] shadow-md sm:h-12 sm:w-12">
									<Kanban className="h-5 w-5 text-[#D4A74A]" />
								</div>
								<span className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-[#F8EED5]">
									Project & Task Management
								</span>
								<span className="mt-1 font-serif text-[10px] italic text-[#D7B05C]">
									Kanban boards and task workflows
								</span>
							</div>

							<div className="relative flex flex-col items-center justify-center rounded-xs border border-[#8F6236]/60 bg-gradient-to-b from-[#3B2415] to-[#1A120C] p-4 shadow-xl">
								<div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#D4A74A] bg-gradient-to-br from-[#8F6236] via-[#5B3922] to-[#1A120C] shadow-md sm:h-12 sm:w-12">
									<Users className="h-5 w-5 text-[#D4A74A]" />
								</div>
								<span className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-[#F8EED5]">
									Team Collaboration
								</span>
								<span className="mt-1 font-serif text-[10px] italic text-[#D7B05C]">
									Roles, assignments, and ownership
								</span>
							</div>

							<div className="relative flex flex-col items-center justify-center rounded-xs border border-[#8F6236]/60 bg-gradient-to-b from-[#3B2415] to-[#1A120C] p-4 shadow-xl">
								<div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#D4A74A] bg-gradient-to-br from-[#8F6236] via-[#5B3922] to-[#1A120C] shadow-md sm:h-12 sm:w-12">
									<Scroll className="h-5 w-5 text-[#D4A74A]" />
								</div>
								<span className="font-sans text-[11px] font-extrabold uppercase tracking-wider text-[#F8EED5]">
									Project Analytics
								</span>
								<span className="mt-1 font-serif text-[10px] italic text-[#D7B05C]">
									Progress, KPIs & activity insights
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* PRODUCT NAVIGATION PLAQUES */}
				<section className="relative z-10 border-t border-[#3B2415] bg-[#1A120C]/90 px-3 py-8 sm:px-6 sm:py-10">
					<div className="container mx-auto max-w-4xl text-center min-w-0">
						<h2 className="mb-6 flex items-center justify-center gap-2 font-sans text-xs font-black uppercase tracking-widest text-[#D4A74A] sm:mb-8 sm:text-lg sm:tracking-[0.2em]">
							<span>⚔</span>
							<span>Enter The Round Table</span>
							<span>⚔</span>
						</h2>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
							<Link
								href="/dashboard"
								className="group relative rounded-xs border-2 border-[#8F6236] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] p-4 transition-all hover:border-[#D4A74A]"
							>
								<div className="mb-1 flex items-center justify-center gap-2 text-[#D4A74A]">
									<LayoutDashboard size={14} />
									<h3 className="font-sans text-xs font-black uppercase tracking-wider text-[#F8EED5]">
										Dashboard
									</h3>
								</div>
								<p className="font-serif text-[11px] italic text-[#D7B05C]">
									Overview & Key Metrics
								</p>
							</Link>

							<Link
								href="/projects"
								className="group relative rounded-xs border-2 border-[#8F6236] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] p-4 transition-all hover:border-[#D4A74A]"
							>
								<div className="mb-1 flex items-center justify-center gap-2 text-[#D4A74A]">
									<BarChart3 size={14} />
									<h3 className="font-sans text-xs font-black uppercase tracking-wider text-[#F8EED5]">
										Projects
									</h3>
								</div>
								<p className="font-serif text-[11px] italic text-[#D7B05C]">
									Project Portfolio & Boards
								</p>
							</Link>

							<Link
								href="/calendar"
								className="group relative rounded-xs border-2 border-[#8F6236] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] p-4 transition-all hover:border-[#D4A74A]"
							>
								<div className="mb-1 flex items-center justify-center gap-2 text-[#D4A74A]">
									<CalendarIcon size={14} />
									<h3 className="font-sans text-xs font-black uppercase tracking-wider text-[#F8EED5]">
										Calendar
									</h3>
								</div>
								<p className="font-serif text-[11px] italic text-[#D7B05C]">
									Deadlines & Milestones
								</p>
							</Link>

							<Link
								href="/analytics"
								className="group relative rounded-xs border-2 border-[#8F6236] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] p-4 transition-all hover:border-[#D4A74A]"
							>
								<div className="mb-1 flex items-center justify-center gap-2 text-[#D4A74A]">
									<Scroll size={14} />
									<h3 className="font-sans text-xs font-black uppercase tracking-wider text-[#F8EED5]">
										Analytics
									</h3>
								</div>
								<p className="font-serif text-[11px] italic text-[#D7B05C]">
									Sprint Audit & Progress
								</p>
							</Link>
						</div>
					</div>
				</section>
			</main>

			{/* FOOTER */}
			<footer className="relative z-10 border-t border-[#3B2415] bg-[#1A120C] py-5 text-center">
				<p className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#D7B05C] sm:text-xs sm:tracking-[0.25em]">
					The Roundtable © Realm Software
				</p>
			</footer>
		</div>
	);
}

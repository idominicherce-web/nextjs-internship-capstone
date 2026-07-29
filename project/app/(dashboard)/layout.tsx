"use client";

import { UserButton } from "@clerk/nextjs";
import {
	BarChart3,
	Bell,
	Calendar,
	FolderOpen,
	Home,
	Menu,
	PanelLeftClose,
	PanelLeftOpen,
	Settings,
	Shield,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { Suspense, useState } from "react";
import { Footer } from "@/components/layout/footer";

const navigation = [
	{
		name: "Dashboard",
		subtext: "Royal Command Center",
		href: "/dashboard",
		icon: Home,
	},
	{
		name: "Projects",
		subtext: "Project Archives",
		href: "/projects",
		icon: FolderOpen,
	},
	{ name: "Team", subtext: "Roundtable Council", href: "/team", icon: Users },
	{
		name: "Analytics",
		subtext: "Intelligence Chamber",
		href: "/analytics",
		icon: BarChart3,
	},
	{
		name: "Calendar",
		subtext: "Quest Ledger",
		href: "/calendar",
		icon: Calendar,
	},
	{
		name: "Settings",
		subtext: "Realm Configuration",
		href: "/settings",
		icon: Settings,
	},
];

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(true);
	const pathname = usePathname();

	return (
		<div className="min-h-screen bg-[#15100C] text-[#F8EEDB] font-serif antialiased selection:bg-[#D7B05C] selection:text-[#15100C]">
			{/* Mobile Overlay */}
			{mobileOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{/* Sidebar Navigation */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 border-r-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-2xl transition-all duration-300 ease-in-out transform lg:translate-x-0 ${
					mobileOpen
						? "translate-x-0 w-64"
						: "-translate-x-full lg:translate-x-0"
				} ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
			>
				{/* Sidebar Header Bar */}
				<div className="flex items-center justify-between h-20 px-3.5 border-b-2 border-[#4A2C1D] shrink-0">
					{isCollapsed && !mobileOpen ? (
						<div className="w-full flex justify-center items-center">
							<button
								type="button"
								onClick={() => setIsCollapsed(false)}
								className="group relative p-2.5 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#FFF5D6] transition-all shadow-md cursor-pointer flex items-center justify-center"
								title="Expand Command Sidebar"
							>
								<Shield
									size={20}
									className="group-hover:hidden transition-all"
								/>
								<PanelLeftOpen
									size={20}
									className="hidden group-hover:block transition-all"
								/>
							</button>
						</div>
					) : (
						<>
							<Link
								href="/dashboard"
								className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden"
							>
								<div className="p-1.5 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md shrink-0">
									<Shield size={18} />
								</div>
								<div className="min-w-0 flex-1">
									<span className="block text-sm sm:text-base font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wide leading-tight truncate">
										Roundtable
									</span>
									<span className="block text-[7.5px] font-sans font-bold text-[#D7B05C]/70 uppercase tracking-wider truncate">
										Royal Command Center
									</span>
								</div>
							</Link>

							<button
								type="button"
								onClick={() => setIsCollapsed(true)}
								className="hidden lg:flex shrink-0 p-1.5 rounded-xs border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors cursor-pointer ml-1"
								title="Collapse Sidebar"
							>
								<PanelLeftClose size={18} />
							</button>
						</>
					)}

					<button
						type="button"
						onClick={() => setMobileOpen(false)}
						className="lg:hidden shrink-0 p-1.5 text-[#D7B05C] hover:text-white"
					>
						<X size={20} />
					</button>
				</div>

				{/* Navigation Items */}
				<nav className="mt-6 px-3 space-y-2 overflow-x-hidden">
					{navigation.map((item) => {
						const isActive =
							pathname === item.href || pathname?.startsWith(`${item.href}/`);
						const Icon = item.icon;

						return (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setMobileOpen(false)}
								title={
									isCollapsed && !mobileOpen
										? `${item.name} • ${item.subtext}`
										: undefined
								}
								className={`flex items-center px-3.5 py-3 rounded-xs border transition-all duration-200 ${
									isActive
										? "border-[#D7B05C] bg-gradient-to-r from-[#5B3922] to-[#2D1B10] text-[#FFF5D6] shadow-[0_0_15px_rgba(215,176,92,0.3)]"
										: "border-transparent text-[#D7B05C]/70 hover:text-[#FFF5D6] hover:bg-[#2D1B10]/60 hover:border-[#8F6236]/40"
								} ${isCollapsed && !mobileOpen ? "justify-center px-0" : ""}`}
							>
								<Icon size={20} className="shrink-0 text-[#D7B05C]" />
								{(!isCollapsed || mobileOpen) && (
									<div className="ml-3 min-w-0 flex-1 truncate transition-all duration-200">
										<span className="block text-xs font-sans font-black uppercase tracking-wider truncate">
											{item.name}
										</span>
										<span className="block text-[9px] font-serif italic text-[#D7B05C]/60 truncate">
											{item.subtext}
										</span>
									</div>
								)}
							</Link>
						);
					})}
				</nav>
			</aside>

			{/* Main Document Content Column */}
			<div
				className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
					isCollapsed ? "lg:ml-20" : "lg:ml-64"
				}`}
			>
				{/* Sticky Header Bar */}
				<header className="sticky top-0 z-30 h-20 flex items-center justify-between border-b-2 border-[#4A2C1D] bg-[#15100C]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-xl">
					<button
						type="button"
						onClick={() => setMobileOpen(true)}
						className="lg:hidden p-2 text-[#D7B05C] hover:text-white"
					>
						<Menu size={22} />
					</button>

					<div className="hidden lg:block" />

					<div className="flex items-center gap-4">
						<button
							type="button"
							className="p-2.5 rounded-xs border border-[#8F6236]/60 bg-[#2D1B10] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors relative cursor-pointer shadow-md"
							title="Notifications"
						>
							<Bell size={18} />
							<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
						</button>

						<UserButton userProfileMode="modal" />
					</div>
				</header>

				{/* Page Content Container */}
				<main className="relative min-h-[calc(100vh-5rem)]">
					<Suspense>{children}</Suspense>
				</main>

				{/* Reusable Consolidated Footer */}
				<Footer />
			</div>
		</div>
	);
}

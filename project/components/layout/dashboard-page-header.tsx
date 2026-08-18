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
import { Suspense, useEffect, useRef, useState } from "react";
import { getNotifications } from "@/actions/notifications";
import { Footer } from "@/components/layout/footer";
import { NotificationDrawer } from "@/components/layout/notification-drawer";
import { useKanbanStore } from "@/stores/use-kanban-store";
import { useNotificationStore } from "@/stores/use-notification-store";
import { useSidebarStore } from "@/stores/use-sidebar-store";

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
	const [showHeader, setShowHeader] = useState(true);
	const lastScrollY = useRef(0);
	const { isCollapsed, setCollapsed } = useSidebarStore();

	const {
		editingTask,
		isCreateTaskModalOpen,
		isInviteMemberModalOpen,
		isAssignProjectMemberModalOpen,
	} = useKanbanStore();

	const isModalOrWorkspaceActive =
		Boolean(editingTask) ||
		isCreateTaskModalOpen ||
		isInviteMemberModalOpen ||
		isAssignProjectMemberModalOpen;

	const pathname = usePathname();

	const { openDrawer, notifications, setNotifications } =
		useNotificationStore();
	const unreadCount = notifications.filter((n) => !n.read).length;

	// Automatically query unread notifications when page mounts
	useEffect(() => {
		getNotifications().then((res) => {
			if (res.success && res.data) {
				const formatted = res.data.map((n) => ({
					id: n.id,
					title: n.title,
					description: n.description || "",
					type: (n.type as any) || "system",
					read: n.read,
					timestamp: new Date(n.createdAt).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
				}));
				setNotifications(formatted);
			}
		});
	}, [setNotifications]);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
				setShowHeader(false);
			} else {
				setShowHeader(true);
			}
			lastScrollY.current = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (isModalOrWorkspaceActive) {
		return (
			<div className="min-h-screen bg-[#15100C] text-[#F8EEDB] font-serif antialiased selection:bg-[#D7B05C] selection:text-[#15100C] overflow-hidden">
				<main className="relative min-h-screen w-full">
					<Suspense>{children}</Suspense>
				</main>
				<NotificationDrawer />
			</div>
		);
	}

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
				aria-label="Command Sidebar"
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
								onClick={() => setCollapsed(false)}
								aria-label="Expand Command Sidebar"
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
								aria-label="Roundtable Home"
								className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden"
							>
								<div className="p-1.5 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md shrink-0">
									<Shield size={18} />
								</div>
								<div className="min-w-0 flex-1">
									<span className="block text-sm sm:text-base font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wide leading-tight truncate">
										Roundtable
									</span>
									<span className="block text-[7.5px] font-sans font-bold text-[#E3C279] uppercase tracking-wider truncate">
										Royal Command Center
									</span>
								</div>
							</Link>

							<button
								type="button"
								onClick={() => setCollapsed(true)}
								aria-label="Collapse Command Sidebar"
								className="hidden lg:flex shrink-0 p-1.5 rounded-xs border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C] hover:text-[#FFF5D6] hover:border-[#D7B05C] transition-colors cursor-pointer ml-1"
								title="Collapse Sidebar"
							>
								<PanelLeftClose size={18} />
							</button>
						</>
					)}

					<button
						type="button"
						onClick={() => setMobileOpen(false)}
						aria-label="Close Mobile Navigation Menu"
						className="lg:hidden shrink-0 p-1.5 text-[#D7B05C] hover:text-white cursor-pointer"
					>
						<X size={20} />
					</button>
				</div>

				{/* Navigation Items */}
				<nav
					aria-label="Main Navigation"
					className="mt-6 px-3 space-y-2 overflow-x-hidden"
				>
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
										: "border-transparent text-[#E3C279] hover:text-[#FFF5D6] hover:bg-[#2D1B10]/60 hover:border-[#8F6236]/40"
								} ${isCollapsed && !mobileOpen ? "justify-center px-0" : ""}`}
							>
								<Icon size={20} className="shrink-0 text-[#D7B05C]" />
								{(!isCollapsed || mobileOpen) && (
									<div className="ml-3 min-w-0 flex-1 truncate transition-all duration-200">
										<span className="block text-xs font-sans font-black uppercase tracking-wider truncate">
											{item.name}
										</span>
										<span className="block text-[9px] font-serif italic text-[#E3C279] truncate">
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
				{/* Smart Sticky Header Bar */}
				<header
					className={`sticky top-0 z-30 h-20 flex items-center justify-between border-b-2 border-[#4A2C1D] bg-[#15100C]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-xl transition-transform duration-300 ease-in-out lg:translate-y-0 ${
						showHeader ? "translate-y-0" : "-translate-y-full"
					}`}
				>
					<button
						type="button"
						onClick={() => setMobileOpen(true)}
						aria-label="Open Mobile Command Menu"
						aria-expanded={mobileOpen}
						className="lg:hidden p-2 text-[#D7B05C] hover:text-white cursor-pointer"
					>
						<Menu size={22} />
					</button>

					<div className="hidden lg:block" />

					{/* Header Actions */}
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={openDrawer}
							aria-label={`View Notifications (${unreadCount} unread)`}
							className="p-2.5 rounded-xs border border-[#8F6236]/60 bg-[#2D1B10] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors relative cursor-pointer shadow-md"
							title="Notifications"
						>
							<Bell size={18} />

							{/* Gold Counter Badge displaying unread count */}
							{unreadCount > 0 && (
								<span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D7B05C] border-2 border-[#1A120C] text-[10px] font-sans font-black text-[#1A120C] shadow-md animate-pulse">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</button>

						<UserButton userProfileMode="modal" />
					</div>
				</header>

				{/* Page Content Container */}
				<main className="relative min-h-[calc(100vh-5rem)]">
					<Suspense>{children}</Suspense>
				</main>

				<NotificationDrawer />
				<Footer />
			</div>
		</div>
	);
}

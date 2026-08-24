"use client";

import { Bell, Check, Loader2, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	deleteAllNotifications,
	deleteNotification,
	getNotifications,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "@/actions/notifications";
import { useNotificationStore } from "@/stores/use-notification-store";

/**
 * Helper to extract [SLUG:...] tag from description text and return clean description + target slug
 */
function parseNotificationSlug(rawDesc?: string | null): {
	cleanDescription: string;
	projectSlug: string | null;
} {
	if (!rawDesc) return { cleanDescription: "", projectSlug: null };

	const slugMatch = rawDesc.match(/\[SLUG:(.*?)\]/);
	const projectSlug = slugMatch ? slugMatch[1] : null;
	const cleanDescription = rawDesc.replace(/\[SLUG:.*?\]/gi, "").trim();

	return { cleanDescription, projectSlug };
}

export function NotificationDrawer() {
	const isOpen = useNotificationStore((state) => state.isOpen);
	const closeDrawer = useNotificationStore((state) => state.closeDrawer);
	const notifications = useNotificationStore((state) => state.notifications);
	const setNotifications = useNotificationStore(
		(state) => state.setNotifications,
	);
	const markAsRead = useNotificationStore((state) => state.markAsRead);
	const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
	const clearNotifications = useNotificationStore(
		(state) => state.clearNotifications,
	);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsLoading(true);
			getNotifications().then((res) => {
				if (res.success && res.data) {
					const formatted = res.data.map((n) => {
						const { cleanDescription, projectSlug } = parseNotificationSlug(
							n.description,
						);
						return {
							id: n.id,
							title: n.title,
							description: cleanDescription,
							projectSlug,
							type: (n.type as any) || "system",
							read: n.read,
							timestamp: new Date(n.createdAt).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							}),
						};
					});
					setNotifications(formatted as any);
				}
				setIsLoading(false);
			});
		}
	}, [isOpen, setNotifications]);

	if (!isOpen) return null;

	const handleMarkRead = async (id: string) => {
		markAsRead(id);
		await markNotificationAsRead(id);
	};

	const handleMarkAllRead = async () => {
		markAllAsRead();
		await markAllNotificationsAsRead();
	};

	const handleDelete = async (id: string) => {
		setNotifications(notifications.filter((n) => n.id !== id));
		await deleteNotification(id);
	};

	const handleClearAll = async () => {
		clearNotifications();
		await deleteAllNotifications();
	};

	return (
		<div className="fixed inset-0 z-[120] font-serif">
			<div
				className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
				onClick={closeDrawer}
			/>

			<aside className="fixed inset-y-0 right-0 z-[130] w-full max-w-sm border-l-2 border-[#4A2C1D] bg-[#1A120C] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto text-[#F8EEDB] animate-in slide-in-from-right duration-200">
				<div className="space-y-4">
					<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
						<div className="flex items-center gap-2">
							<Bell size={18} className="text-[#D7B05C]" />
							<h2 className="font-black text-base uppercase tracking-wider text-[#F8EEDB]">
								Notifications
							</h2>
						</div>
						<button
							type="button"
							onClick={closeDrawer}
							aria-label="Close Notifications Drawer"
							className="p-1 text-[#E3C279] hover:text-white transition-colors cursor-pointer"
						>
							<X size={18} />
						</button>
					</div>

					<div className="flex items-center justify-between font-sans text-xs pt-1">
						<button
							type="button"
							onClick={handleMarkAllRead}
							className="text-[#D7B05C] hover:underline font-bold cursor-pointer flex items-center gap-1"
						>
							<Check size={14} />
							<span>Mark all as read</span>
						</button>
						<button
							type="button"
							onClick={handleClearAll}
							className="text-rose-400 hover:underline font-bold cursor-pointer flex items-center gap-1"
						>
							<Trash2 size={14} />
							<span>Clear all</span>
						</button>
					</div>

					{isLoading ? (
						<div className="flex items-center justify-center py-12 gap-2 text-xs font-sans text-[#D7B05C]">
							<Loader2 size={16} className="animate-spin text-[#D7B05C]" />
							<span>Fetching dispatches...</span>
						</div>
					) : notifications.length === 0 ? (
						<p className="text-center text-xs font-serif italic text-[#E3C279] py-8">
							No unread dispatches at this time.
						</p>
					) : (
						<div className="space-y-2.5 font-sans text-xs">
							{notifications.map((n: any) => {
								const { cleanDescription, projectSlug } = parseNotificationSlug(
									n.description,
								);
								const targetSlug = n.projectSlug || projectSlug;
								const targetHref = targetSlug
									? `/projects/${targetSlug}`
									: "/projects";

								return (
									<div
										key={n.id}
										className={`p-3 rounded-xs border transition-colors relative ${
											n.read
												? "border-[#4A2C1D]/60 bg-[#15100C]/60 text-[#E3C279]"
												: "border-[#8F6236] bg-[#2D1B10] text-[#F8EEDB] shadow-md"
										}`}
									>
										<div className="flex items-start justify-between gap-2">
											<Link
												href={targetHref}
												onClick={closeDrawer}
												className="font-bold text-xs pr-4 hover:text-[#D7B05C] transition-colors leading-snug"
											>
												{n.title}
											</Link>
											<div className="flex items-center gap-1 shrink-0">
												{!n.read && (
													<button
														type="button"
														onClick={() => handleMarkRead(n.id)}
														aria-label="Mark read"
														title="Mark as read"
														className="p-1 text-[#D7B05C] hover:text-white cursor-pointer"
													>
														<Check size={12} />
													</button>
												)}
												<button
													type="button"
													onClick={() => handleDelete(n.id)}
													aria-label="Delete notification"
													title="Delete notification"
													className="p-1 text-rose-400/70 hover:text-rose-300 cursor-pointer"
												>
													<Trash2 size={12} />
												</button>
											</div>
										</div>

										{cleanDescription && (
											<Link
												href={targetHref}
												onClick={closeDrawer}
												className="block text-[11px] text-[#E3C279] mt-1 hover:underline leading-relaxed"
											>
												{cleanDescription}
											</Link>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</aside>
		</div>
	);
}

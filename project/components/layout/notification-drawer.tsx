"use client";

import { Bell, Check, Trash2, X } from "lucide-react";
import {
	deleteAllNotifications,
	deleteNotification,
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "@/actions/notifications";
import { useNotificationStore } from "@/stores/use-notification-store";

export function NotificationDrawer() {
	const isOpen = useNotificationStore((state) => state.isOpen);
	const closeDrawer = useNotificationStore((state) => state.closeDrawer);
	const notifications = useNotificationStore((state) => state.notifications);
	const markAsRead = useNotificationStore((state) => state.markAsRead);
	const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
	const clearNotifications = useNotificationStore(
		(state) => state.clearNotifications,
	);

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
		clearNotifications();
		await deleteNotification(id);
	};

	const handleClearAll = async () => {
		clearNotifications();
		await deleteAllNotifications();
	};

	return (
		<div className="fixed inset-0 z-[120] font-serif">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
				onClick={closeDrawer}
			/>

			{/* Drawer Panel */}
			<aside className="fixed inset-y-0 right-0 z-[130] w-full max-w-sm border-l-2 border-[#4A2C1D] bg-[#1A120C] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto text-[#F8EEDB] animate-in slide-in-from-right duration-200">
				<div className="space-y-4">
					{/* Header */}
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

					{/* Global Actions */}
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

					{/* Notification Items */}
					{notifications.length === 0 ? (
						<p className="text-center text-xs font-serif italic text-[#E3C279] py-8">
							No unread dispatches at this time.
						</p>
					) : (
						<div className="space-y-2.5 font-sans text-xs">
							{notifications.map((n) => (
								<div
									key={n.id}
									className={`p-3 rounded-xs border transition-colors relative ${
										n.read
											? "border-[#4A2C1D]/60 bg-[#15100C]/60 text-[#E3C279]"
											: "border-[#8F6236] bg-[#2D1B10] text-[#F8EEDB] shadow-md"
									}`}
								>
									<div className="flex items-start justify-between gap-2">
										<h3 className="font-bold text-xs pr-4">{n.title}</h3>
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
									{n.description && (
										<p className="text-[11px] text-[#E3C279] mt-1">
											{n.description}
										</p>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</aside>
		</div>
	);
}

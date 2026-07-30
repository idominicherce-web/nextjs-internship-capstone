"use client";

import {
	Bell,
	CheckCheck,
	CheckCircle2,
	Clock,
	FolderKanban,
	ShieldAlert,
	Trash2,
	Users,
	X,
} from "lucide-react";
import {
	type NotificationItem,
	useNotificationStore,
} from "@/stores/use-notification-store";

export function NotificationDrawer() {
	const {
		isOpen,
		notifications,
		closeDrawer,
		markAsRead,
		markAllAsRead,
		clearNotifications,
	} = useNotificationStore();

	if (!isOpen) return null;

	const unreadCount = notifications.filter((n) => !n.read).length;

	const getIcon = (type: NotificationItem["type"]) => {
		switch (type) {
			case "task":
				return <CheckCircle2 size={16} className="text-[#D7B05C]" />;
			case "project":
				return <FolderKanban size={16} className="text-amber-400" />;
			case "team":
				return <Users size={16} className="text-emerald-400" />;
			default:
				return <ShieldAlert size={16} className="text-sky-400" />;
		}
	};

	return (
		<div className="fixed inset-0 z-50 overflow-hidden font-serif">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
				onClick={closeDrawer}
			/>

			<aside className="absolute inset-y-0 right-0 max-w-full flex pl-10">
				<div className="w-screen max-w-md border-l-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-2xl flex flex-col">
					{/* Drawer Header */}
					<div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-[#4A2C1D] bg-[#15100C]/90">
						<div className="flex items-center space-x-3">
							<div className="p-2 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md relative">
								<Bell size={18} />
								{unreadCount > 0 && (
									<span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
								)}
							</div>
							<div>
								<div className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-[#D7B05C]">
									Royal Dispatch • {unreadCount} Unread
								</div>
								<h2 className="text-base sm:text-lg font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wider">
									Notifications
								</h2>
							</div>
						</div>

						<button
							type="button"
							onClick={closeDrawer}
							className="p-1.5 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
						>
							<X size={20} />
						</button>
					</div>

					{/* Action Toolbar */}
					{notifications.length > 0 && (
						<div className="flex items-center justify-between px-4 py-2.5 border-b border-[#4A2C1D] bg-[#15100C]/50 text-xs font-sans font-bold">
							<button
								type="button"
								onClick={markAllAsRead}
								className="inline-flex items-center gap-1.5 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
							>
								<CheckCheck size={14} />
								<span>Mark All Read</span>
							</button>
							<button
								type="button"
								onClick={clearNotifications}
								className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
							>
								<Trash2 size={13} />
								<span>Clear All</span>
							</button>
						</div>
					)}

					{/* Notification Items List */}
					<div className="flex-1 overflow-y-auto p-4 space-y-3">
						{notifications.length === 0 ? (
							<div className="text-center py-16 border-2 border-dashed border-[#8F6236]/30 bg-[#15100C]/60 rounded-xs space-y-2">
								<Bell size={28} className="mx-auto text-[#D7B05C]/40" />
								<p className="text-sm font-bold text-[#F8EEDB]">
									No Dispatches Found
								</p>
								<p className="text-xs text-[#D7B05C]/60 max-w-xs mx-auto">
									Your royal command feed is quiet. Check back when new decrees
									or assignments arrive.
								</p>
							</div>
						) : (
							notifications.map((item) => (
								<div
									key={item.id}
									onClick={() => markAsRead(item.id)}
									className={`p-3.5 rounded-xs border transition-all cursor-pointer relative ${
										item.read
											? "border-[#4A2C1D]/60 bg-[#15100C]/40 text-[#F8EEDB]/70"
											: "border-[#8F6236] bg-[#2D1B10]/80 text-[#FFF5D6] shadow-md"
									}`}
								>
									{!item.read && (
										<span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#D7B05C]" />
									)}
									<div className="flex items-start gap-3">
										<div className="p-1.5 rounded-xs border border-[#8F6236]/60 bg-[#15100C] shrink-0 mt-0.5">
											{getIcon(item.type)}
										</div>
										<div className="min-w-0 flex-1">
											<h4 className="text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
												{item.title}
											</h4>
											<p className="text-xs font-sans mt-0.5 text-[#F8EEDB]/90 leading-snug">
												{item.description}
											</p>
											<div className="flex items-center gap-1 mt-2 text-[10px] font-sans text-[#D7B05C]/60">
												<Clock size={11} />
												<span>{item.timestamp}</span>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</aside>
		</div>
	);
}

"use client";

import { Bell, Shield, User } from "lucide-react";

export type SettingsTab = "profile" | "security" | "notifications";

interface SettingsNavigationProps {
	activeTab: SettingsTab;
	onTabChange: (tab: SettingsTab) => void;
}

export function SettingsNavigation({
	activeTab,
	onTabChange,
}: SettingsNavigationProps) {
	const accountItems = [
		{
			id: "profile" as SettingsTab,
			label: "Profile",
			subtext: "Royal Identity",
			icon: User,
		},
		{
			id: "security" as SettingsTab,
			label: "Security",
			subtext: "Castle Defenses",
			icon: Shield,
		},
	];

	const workspaceItems = [
		{
			id: "notifications" as SettingsTab,
			label: "Notifications",
			subtext: "Royal Dispatches",
			icon: Bell,
		},
	];

	return (
		<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-5 select-none font-serif">
			{/* Account Section */}
			<div className="space-y-1.5">
				<h2 className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#E3C279] px-2">
					Account
				</h2>
				<nav aria-label="Account Settings Navigation" className="space-y-1">
					{accountItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeTab === item.id;
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => onTabChange(item.id)}
								aria-label={`Navigate to ${item.label} settings`}
								className={`w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs font-sans transition-all cursor-pointer ${
									isActive
										? "bg-[#2D1B10] text-[#FFF5D6] border-l-4 border-[#D7B05C] shadow-sm pl-2.5 font-bold"
										: "text-[#E3C279] hover:text-[#FFF5D6] hover:bg-[#2D1B10]/40 border-l-4 border-transparent"
								}`}
							>
								<div className="flex items-center gap-2.5 min-w-0">
									<Icon
										size={15}
										className={isActive ? "text-[#D7B05C]" : "text-[#E3C279]"}
									/>
									<div className="text-left min-w-0">
										<span className="block truncate">{item.label}</span>
										<span className="block text-[9px] font-serif italic text-[#E3C279] truncate">
											{item.subtext}
										</span>
									</div>
								</div>
							</button>
						);
					})}
				</nav>
			</div>

			{/* Workspace Section */}
			<div className="space-y-1.5 pt-2 border-t border-[#4A2C1D]">
				<h2 className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#E3C279] px-2">
					Workspace
				</h2>
				<nav aria-label="Workspace Settings Navigation" className="space-y-1">
					{workspaceItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeTab === item.id;
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => onTabChange(item.id)}
								aria-label={`Navigate to ${item.label} settings`}
								className={`w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs font-sans transition-all cursor-pointer ${
									isActive
										? "bg-[#2D1B10] text-[#FFF5D6] border-l-4 border-[#D7B05C] shadow-sm pl-2.5 font-bold"
										: "text-[#E3C279] hover:text-[#FFF5D6] hover:bg-[#2D1B10]/40 border-l-4 border-transparent"
								}`}
							>
								<div className="flex items-center gap-2.5 min-w-0">
									<Icon
										size={15}
										className={isActive ? "text-[#D7B05C]" : "text-[#E3C279]"}
									/>
									<div className="text-left min-w-0">
										<span className="block truncate">{item.label}</span>
										<span className="block text-[9px] font-serif italic text-[#E3C279] truncate">
											{item.subtext}
										</span>
									</div>
								</div>
							</button>
						);
					})}
				</nav>
			</div>
		</div>
	);
}

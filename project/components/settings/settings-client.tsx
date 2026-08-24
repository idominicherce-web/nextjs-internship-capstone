"use client";

import { useState } from "react";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { NotificationSettingsForm } from "@/components/settings/notification-settings-form";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { SecuritySection } from "@/components/settings/security-section";
import {
	SettingsNavigation,
	type SettingsTab,
} from "@/components/settings/settings-navigation";

interface SettingsClientProps {
	user: {
		name?: string | null;
		email: string;
		role?: string | null;
		createdAt?: Date | string;
	};
	initialSettings?: any;
}

export function SettingsClient({ user, initialSettings }: SettingsClientProps) {
	const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

	return (
		<DashboardLayoutContainer>
			{/* Header Bar */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 relative">
				<div>
					<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
						<span>⚔</span>
						<span>Realm Configuration</span>
						<span>⚔</span>
					</div>
					<h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
						Settings
					</h1>
					<p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-2 italic max-w-2xl leading-relaxed">
						Manage your account details, security policies, and workspace
						preferences.
					</p>
				</div>
			</div>

			{/* Decorative Heraldic Divider */}
			<div className="flex items-center justify-center gap-4 text-[#B78B3E] text-xs py-2 my-2">
				<div className="h-px w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
				<span>⚔ ──── ⚜ ──── ⚔</span>
				<div className="h-px w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
			</div>

			{/* Settings Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Navigation Sidebar (3 Columns) */}
				<div className="lg:col-span-3">
					<SettingsNavigation
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>
				</div>

				{/* Active Settings Panel (9 Columns) */}
				<div className="lg:col-span-9">
					{activeTab === "profile" && <ProfileSettingsForm user={user} />}
					{activeTab === "security" && <SecuritySection />}
					{activeTab === "notifications" && (
						<NotificationSettingsForm initialSettings={initialSettings} />
					)}
				</div>
			</div>
		</DashboardLayoutContainer>
	);
}

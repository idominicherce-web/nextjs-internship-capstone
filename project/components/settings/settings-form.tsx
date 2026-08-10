"use client";

import { Bell, CheckCircle2, Loader2, Shield, User } from "lucide-react";
import { useState } from "react";
import { updateUserSettings } from "@/actions/settings";
import { useNotificationStore } from "@/stores/use-notification-store";

interface SettingsFormProps {
	user: {
		name?: string | null;
		email: string;
		role?: string | null;
	};
	initialSettings: any;
}

export function SettingsForm({ user, initialSettings }: SettingsFormProps) {
	const [taskAssignedInApp, setTaskAssignedInApp] = useState(
		initialSettings?.taskAssignedInApp ?? true,
	);
	const [taskAssignedEmail, setTaskAssignedEmail] = useState(
		initialSettings?.taskAssignedEmail ?? true,
	);
	const [dueDatesInApp, setDueDatesInApp] = useState(
		initialSettings?.dueDatesInApp ?? true,
	);
	const [dueDatesEmail, setDueDatesEmail] = useState(
		initialSettings?.dueDatesEmail ?? true,
	);
	const [mentionsInApp, setMentionsInApp] = useState(
		initialSettings?.mentionsInApp ?? true,
	);
	const [mentionsEmail, setMentionsEmail] = useState(
		initialSettings?.mentionsEmail ?? false,
	);
	const [emailDigest, setEmailDigest] = useState(
		initialSettings?.emailDigest ?? "daily",
	);

	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const res = await updateUserSettings({
			taskAssignedInApp,
			taskAssignedEmail,
			dueDatesInApp,
			dueDatesEmail,
			mentionsInApp,
			mentionsEmail,
			emailDigest,
		});

		setIsLoading(false);

		if (res.success) {
			setIsSuccess(true);
			addNotification({
				title: "Preferences Saved",
				description: "Realm notification settings updated.",
				type: "system",
			});

			setTimeout(() => setIsSuccess(false), 2000);
		}
	};

	return (
		<form onSubmit={handleSave} className="space-y-6 font-serif">
			{/* Officer Profile Dossier */}
			<div className="p-6 rounded-xs border-2 border-[#8F6236] bg-[#1A120C] shadow-xl space-y-4">
				<div className="flex items-center gap-2 border-b border-[#4A2C1D] pb-3 text-[#D7B05C]">
					<User size={20} />
					<h3 className="font-serif font-black text-base uppercase tracking-wider text-[#F8EEDB]">
						Officer Identity
					</h3>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
					<div className="space-y-1">
						<span className="block font-bold uppercase text-[#D7B05C]/70">
							Full Name
						</span>
						<div className="p-2.5 bg-[#2D1B10] border border-[#8F6236]/60 text-[#F8EEDB] rounded-xs font-semibold">
							{user.name || "Officer"}
						</div>
					</div>

					<div className="space-y-1">
						<span className="block font-bold uppercase text-[#D7B05C]/70">
							Email Address
						</span>
						<div className="p-2.5 bg-[#2D1B10] border border-[#8F6236]/60 text-[#F8EEDB] rounded-xs font-semibold truncate">
							{user.email}
						</div>
					</div>

					<div className="space-y-1">
						<span className="block font-bold uppercase text-[#D7B05C]/70">
							Designated Rank
						</span>
						<div className="p-2.5 bg-[#2D1B10] border border-[#8F6236]/60 text-[#D7B05C] rounded-xs font-black uppercase">
							{user.role || "Project Manager"}
						</div>
					</div>
				</div>
			</div>

			{/* Notification Dispatches */}
			<div className="p-6 rounded-xs border-2 border-[#8F6236] bg-[#1A120C] shadow-xl space-y-5">
				<div className="flex items-center gap-2 border-b border-[#4A2C1D] pb-3 text-[#D7B05C]">
					<Bell size={20} />
					<h3 className="font-serif font-black text-base uppercase tracking-wider text-[#F8EEDB]">
						Notification & Dispatch Rules
					</h3>
				</div>

				<div className="space-y-4 text-xs font-sans">
					{/* Task Assignment */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
						<div>
							<h4 className="font-bold text-[#F8EEDB] uppercase">
								Task Assignment Alerts
							</h4>
							<p className="text-[11px] text-[#D7B05C]/70 italic">
								Receive dispatches when you are deployed to an objective.
							</p>
						</div>
						<div className="flex items-center gap-4">
							<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
								<input
									type="checkbox"
									checked={taskAssignedInApp}
									onChange={(e) => setTaskAssignedInApp(e.target.checked)}
									className="accent-[#D7B05C] h-4 w-4"
								/>
								<span>In-App</span>
							</label>
							<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
								<input
									type="checkbox"
									checked={taskAssignedEmail}
									onChange={(e) => setTaskAssignedEmail(e.target.checked)}
									className="accent-[#D7B05C] h-4 w-4"
								/>
								<span>Email</span>
							</label>
						</div>
					</div>

					{/* Target Deadlines */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
						<div>
							<h4 className="font-bold text-[#F8EEDB] uppercase">
								Deadline Reminders
							</h4>
							<p className="text-[11px] text-[#D7B05C]/70 italic">
								Get notified when assigned tasks are nearing due dates.
							</p>
						</div>
						<div className="flex items-center gap-4">
							<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
								<input
									type="checkbox"
									checked={dueDatesInApp}
									onChange={(e) => setDueDatesInApp(e.target.checked)}
									className="accent-[#D7B05C] h-4 w-4"
								/>
								<span>In-App</span>
							</label>
							<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
								<input
									type="checkbox"
									checked={dueDatesEmail}
									onChange={(e) => setDueDatesEmail(e.target.checked)}
									className="accent-[#D7B05C] h-4 w-4"
								/>
								<span>Email</span>
							</label>
						</div>
					</div>

					{/* Council Mentions */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
						<div>
							<h4 className="font-bold text-[#F8EEDB] uppercase">
								Council Comment Dispatches
							</h4>
							<p className="text-[11px] text-[#D7B05C]/70 italic">
								Alerts when officers post updates on your assigned tasks.
							</p>
						</div>
						<div className="flex items-center gap-4">
							<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
								<input
									type="checkbox"
									checked={mentionsInApp}
									onChange={(e) => setMentionsInApp(e.target.checked)}
									className="accent-[#D7B05C] h-4 w-4"
								/>
								<span>In-App</span>
							</label>
							<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
								<input
									type="checkbox"
									checked={mentionsEmail}
									onChange={(e) => setMentionsEmail(e.target.checked)}
									className="accent-[#D7B05C] h-4 w-4"
								/>
								<span>Email</span>
							</label>
						</div>
					</div>

					{/* Email Digest Cadence */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
						<div>
							<h4 className="font-bold text-[#F8EEDB] uppercase">
								Digest Frequency
							</h4>
							<p className="text-[11px] text-[#D7B05C]/70 italic">
								Summary reports delivered to your inbox.
							</p>
						</div>
						<select
							value={emailDigest}
							onChange={(e) => setEmailDigest(e.target.value)}
							className="px-3 py-1.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
						>
							<option value="daily">Daily Briefing</option>
							<option value="weekly">Weekly Report</option>
							<option value="never">Never</option>
						</select>
					</div>
				</div>
			</div>

			{/* Success Banner & Actions */}
			<div className="flex items-center justify-between pt-2">
				{isSuccess ? (
					<div className="flex items-center gap-2 text-xs font-sans text-emerald-400 bg-emerald-950/80 px-3 py-2 border border-emerald-700 rounded-xs">
						<CheckCircle2 size={16} />
						<span>Configuration successfully updated!</span>
					</div>
				) : (
					<div />
				)}

				<button
					type="submit"
					disabled={isLoading}
					className="px-6 py-2.5 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer ml-auto"
				>
					{isLoading ? (
						<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
					) : (
						<Shield size={14} className="text-[#D7B05C]" />
					)}
					<span>{isLoading ? "Saving..." : "Save Configuration"}</span>
				</button>
			</div>
		</form>
	);
}

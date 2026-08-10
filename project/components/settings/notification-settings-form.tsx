"use client";

import { Bell, CheckCircle2, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { updateUserSettings } from "@/actions/settings";
import { useNotificationStore } from "@/stores/use-notification-store";

interface NotificationSettingsFormProps {
	initialSettings: any;
}

export function NotificationSettingsForm({
	initialSettings,
}: NotificationSettingsFormProps) {
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
	const [isSaved, setIsSaved] = useState(false);

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
			setIsSaved(true);
			addNotification({
				title: "Dispatch Preferences Saved",
				description: "Realm notification settings updated in database.",
				type: "system",
			});

			setTimeout(() => setIsSaved(false), 3000);
		}
	};

	return (
		<div className="rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl p-6 sm:p-8 space-y-6 font-serif">
			{/* Section Header */}
			<div className="border-b border-[#4A2C1D] pb-4 flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<Bell size={18} className="text-[#D7B05C]" />
						<h3 className="font-serif font-black text-xl text-[#F8EEDB]">
							Notification & Dispatch Rules
						</h3>
					</div>
					<p className="text-xs font-sans text-[#D7B05C]/80 mt-1 italic">
						Configure in-app alerts and email summary digest frequencies.
					</p>
				</div>

				<span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#D7B05C]/60 bg-[#15100C] border border-[#8F6236]/40 px-2.5 py-1 rounded-xs shrink-0">
					Royal Dispatches
				</span>
			</div>

			<form onSubmit={handleSave} className="space-y-5 max-w-2xl">
				{/* Task Assignment */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
					<div>
						<h4 className="font-sans font-extrabold text-xs text-[#F8EEDB] uppercase tracking-wider">
							Task Assignment Alerts
						</h4>
						<p className="text-[11px] font-sans text-[#D7B05C]/70 italic mt-0.5">
							Receive dispatches when you are deployed to an objective.
						</p>
					</div>
					<div className="flex items-center gap-4 text-xs font-sans">
						<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
							<input
								type="checkbox"
								checked={taskAssignedInApp}
								onChange={(e) => setTaskAssignedInApp(e.target.checked)}
								className="accent-[#D7B05C] h-4 w-4 rounded-xs"
							/>
							<span>In-App</span>
						</label>
						<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
							<input
								type="checkbox"
								checked={taskAssignedEmail}
								onChange={(e) => setTaskAssignedEmail(e.target.checked)}
								className="accent-[#D7B05C] h-4 w-4 rounded-xs"
							/>
							<span>Email</span>
						</label>
					</div>
				</div>

				{/* Deadline Reminders */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
					<div>
						<h4 className="font-sans font-extrabold text-xs text-[#F8EEDB] uppercase tracking-wider">
							Deadline Reminders
						</h4>
						<p className="text-[11px] font-sans text-[#D7B05C]/70 italic mt-0.5">
							Get notified when assigned tasks are nearing due dates.
						</p>
					</div>
					<div className="flex items-center gap-4 text-xs font-sans">
						<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
							<input
								type="checkbox"
								checked={dueDatesInApp}
								onChange={(e) => setDueDatesInApp(e.target.checked)}
								className="accent-[#D7B05C] h-4 w-4 rounded-xs"
							/>
							<span>In-App</span>
						</label>
						<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
							<input
								type="checkbox"
								checked={dueDatesEmail}
								onChange={(e) => setDueDatesEmail(e.target.checked)}
								className="accent-[#D7B05C] h-4 w-4 rounded-xs"
							/>
							<span>Email</span>
						</label>
					</div>
				</div>

				{/* Council Comments */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
					<div>
						<h4 className="font-sans font-extrabold text-xs text-[#F8EEDB] uppercase tracking-wider">
							Council Comment Dispatches
						</h4>
						<p className="text-[11px] font-sans text-[#D7B05C]/70 italic mt-0.5">
							Alerts when officers post updates on your assigned tasks.
						</p>
					</div>
					<div className="flex items-center gap-4 text-xs font-sans">
						<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
							<input
								type="checkbox"
								checked={mentionsInApp}
								onChange={(e) => setMentionsInApp(e.target.checked)}
								className="accent-[#D7B05C] h-4 w-4 rounded-xs"
							/>
							<span>In-App</span>
						</label>
						<label className="flex items-center gap-1.5 text-[#D7B05C] cursor-pointer">
							<input
								type="checkbox"
								checked={mentionsEmail}
								onChange={(e) => setMentionsEmail(e.target.checked)}
								className="accent-[#D7B05C] h-4 w-4 rounded-xs"
							/>
							<span>Email</span>
						</label>
					</div>
				</div>

				{/* Email Digest Cadence */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
					<div>
						<h4 className="font-sans font-extrabold text-xs text-[#F8EEDB] uppercase tracking-wider">
							Digest Frequency
						</h4>
						<p className="text-[11px] font-sans text-[#D7B05C]/70 italic mt-0.5">
							Summary reports delivered directly to your inbox.
						</p>
					</div>
					<select
						value={emailDigest}
						onChange={(e) => setEmailDigest(e.target.value)}
						className="px-3.5 py-2 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer shadow-md"
					>
						<option value="daily">Daily Briefing</option>
						<option value="weekly">Weekly Report</option>
						<option value="never">Never Send</option>
					</select>
				</div>

				{/* Form Actions Footer Bar */}
				<div className="flex items-center justify-between pt-6 border-t border-[#4A2C1D]">
					{isSaved ? (
						<span className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-emerald-400">
							<CheckCircle2 size={16} /> Preferences updated successfully.
						</span>
					) : (
						<span className="text-[11px] font-serif italic text-[#D7B05C]/60">
							Select rules to govern real-time dispatches.
						</span>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="px-5 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] hover:shadow-[0_0_15px_rgba(215,176,92,0.3)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
					>
						{isLoading ? (
							<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
						) : (
							<Shield size={14} className="text-[#D7B05C]" />
						)}
						<span>{isLoading ? "Saving..." : "Save Preferences"}</span>
					</button>
				</div>
			</form>
		</div>
	);
}

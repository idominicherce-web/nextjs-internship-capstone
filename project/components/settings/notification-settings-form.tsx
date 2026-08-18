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
	const [dueDatesInApp, setDueDatesInApp] = useState(
		initialSettings?.dueDatesInApp ?? true,
	);
	const [mentionsInApp, setMentionsInApp] = useState(
		initialSettings?.mentionsInApp ?? true,
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
			dueDatesInApp,
			mentionsInApp,
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
						Configure which real-time alerts appear on your notifications
						drawer.
					</p>
				</div>

				<span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#D7B05C]/60 bg-[#15100C] border border-[#8F6236]/40 px-2.5 py-1 rounded-xs shrink-0">
					Royal Dispatches
				</span>
			</div>

			<form onSubmit={handleSave} className="space-y-5 max-w-2xl">
				{/* Task Assignment */}
				<div className="flex items-center justify-between gap-4 p-4 bg-[#15100C] border border-[#4A2C1D] rounded-xs shadow-inner">
					<div>
						<h4 className="font-sans font-extrabold text-xs text-[#F8EEDB] uppercase tracking-wider">
							Task Assignment Alerts
						</h4>
						<p className="text-[11px] font-sans text-[#D7B05C]/70 italic mt-0.5">
							Receive dispatches when you are deployed to an objective.
						</p>
					</div>

					{/* Smooth Sliding Toggle Switch */}
					<button
						type="button"
						role="switch"
						aria-checked={taskAssignedInApp}
						onClick={() => setTaskAssignedInApp(!taskAssignedInApp)}
						className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none ${
							taskAssignedInApp
								? "bg-[#D7B05C] border-[#F8EEDB]"
								: "bg-[#2D1B10] border-[#8F6236]/60"
						}`}
					>
						<span
							className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md transition duration-200 ease-in-out ${
								taskAssignedInApp
									? "translate-x-5 bg-[#1A120C]"
									: "translate-x-0 bg-[#8F6236]/80"
							}`}
						/>
					</button>
				</div>

				{/* Deadline Reminders */}
				<div className="flex items-center justify-between gap-4 p-4 bg-[#15100C] border border-[#4A2C1D] rounded-xs shadow-inner">
					<div>
						<h4 className="font-sans font-extrabold text-xs text-[#F8EEDB] uppercase tracking-wider">
							Deadline Reminders
						</h4>
						<p className="text-[11px] font-sans text-[#D7B05C]/70 italic mt-0.5">
							Get notified when assigned tasks are nearing due dates.
						</p>
					</div>

					{/* Smooth Sliding Toggle Switch */}
					<button
						type="button"
						role="switch"
						aria-checked={dueDatesInApp}
						onClick={() => setDueDatesInApp(!dueDatesInApp)}
						className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none ${
							dueDatesInApp
								? "bg-[#D7B05C] border-[#F8EEDB]"
								: "bg-[#2D1B10] border-[#8F6236]/60"
						}`}
					>
						<span
							className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md transition duration-200 ease-in-out ${
								dueDatesInApp
									? "translate-x-5 bg-[#1A120C]"
									: "translate-x-0 bg-[#8F6236]/80"
							}`}
						/>
					</button>
				</div>

				{/* Council Comments */}
				<div className="flex items-center justify-between gap-4 p-4 bg-[#15100C] border border-[#4A2C1D] rounded-xs shadow-inner">
					<div>
						<h4 className="font-sans font-extrabold text-xs text-[#F8EEDB] uppercase tracking-wider">
							Council Comment Dispatches
						</h4>
						<p className="text-[11px] font-sans text-[#D7B05C]/70 italic mt-0.5">
							Alerts when officers post updates on your assigned tasks.
						</p>
					</div>

					{/* Smooth Sliding Toggle Switch */}
					<button
						type="button"
						role="switch"
						aria-checked={mentionsInApp}
						onClick={() => setMentionsInApp(!mentionsInApp)}
						className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 p-0.5 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none ${
							mentionsInApp
								? "bg-[#D7B05C] border-[#F8EEDB]"
								: "bg-[#2D1B10] border-[#8F6236]/60"
						}`}
					>
						<span
							className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md transition duration-200 ease-in-out ${
								mentionsInApp
									? "translate-x-5 bg-[#1A120C]"
									: "translate-x-0 bg-[#8F6236]/80"
							}`}
						/>
					</button>
				</div>

				{/* Form Actions Footer Bar */}
				<div className="flex items-center justify-between pt-6 border-t border-[#4A2C1D]">
					{isSaved ? (
						<span className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-emerald-400">
							<CheckCircle2 size={16} /> Preferences updated successfully.
						</span>
					) : (
						<span className="text-[11px] font-serif italic text-[#D7B05C]/60">
							Toggle switches to govern real-time dispatches.
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

"use client";

import {
	Calendar,
	CheckCircle,
	Loader2,
	Scroll,
	Shield,
	User as UserIcon,
	X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { updateTask } from "@/actions/tasks";

interface Task {
	id: string;
	title: string;
	description: string | null;
	dueDate?: Date | string | null;
	userId?: string | null;
}

interface UserOption {
	id: string;
	name: string | null;
	email: string;
}

interface TaskDetailModalProps {
	task: Task | null;
	projectId: string;
	isOpen: boolean;
	users?: UserOption[];
	onClose: () => void;
}

export function TaskDetailModal({
	task,
	projectId,
	isOpen,
	users = [],
	onClose,
}: TaskDetailModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [assignedUserId, setAssignedUserId] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");

	useEffect(() => {
		if (task) {
			setTitle(task.title || "");
			setDescription(task.description || "");
			setDueDate(
				task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
			);
			setAssignedUserId(task.userId || "");
		}
	}, [task]);

	if (!isOpen || !task) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		setIsLoading(true);
		setSuccessMsg("");

		const result = await updateTask(task.id, projectId, {
			title: title.trim(),
			description: description.trim() || null,
			dueDate: dueDate ? new Date(dueDate) : null,
			userId: assignedUserId || null,
		});

		setIsLoading(false);

		if (result.success) {
			setSuccessMsg("Task decree updated successfully!");
			setTimeout(() => {
				setSuccessMsg("");
				onClose();
			}, 1000);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs font-serif text-[#F8EEDB]">
			<div className="relative w-full max-w-lg rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden">
				{/* Forged Brass Corner Brackets */}
				<div className="absolute left-1 top-1 w-3.5 h-3.5 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute right-1 top-1 w-3.5 h-3.5 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute bottom-1 left-1 w-3.5 h-3.5 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute bottom-1 right-1 w-3.5 h-3.5 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />

				{/* Modal Header Plank */}
				<div className="flex items-center justify-between border-b-2 border-[#4A2C1D] pb-4 mb-5">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md">
							<Scroll size={22} />
						</div>
						<div>
							<div className="text-[9px] font-sans font-black uppercase tracking-[0.25em] text-[#D7B05C]">
								Objective Ledger •{" "}
								<span className="italic font-serif text-[#D7B05C]/70">
									Task Details
								</span>
							</div>
							<h2 className="text-xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wider">
								Edit Objective
							</h2>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="p-1 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
					>
						<X size={20} />
					</button>
				</div>

				{/* Success Alert Banner */}
				{successMsg && (
					<div className="mb-4 rounded-xs bg-emerald-950/80 border border-emerald-600 p-3 text-xs font-sans font-bold text-emerald-300 flex items-center gap-2 shadow-inner">
						<CheckCircle size={16} className="text-emerald-400" />
						<span>{successMsg}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Title Input */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Objective Title <span className="text-rose-400">*</span>
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/70 focus:outline-none focus:border-[#D7B05C] shadow-inner"
						/>
					</div>

					{/* Description Input */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Mission Brief / Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							placeholder="Add tactical details about this objective..."
							className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/70 focus:outline-none focus:border-[#D7B05C] shadow-inner resize-none"
						/>
					</div>

					{/* Grid: Assignee & Due Date */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
						{/* Assignee Selection */}
						<div className="space-y-1">
							<label className="flex items-center gap-1.5 text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
								<UserIcon size={14} className="text-[#D7B05C]" />
								<span>Assigned Officer</span>
							</label>
							<select
								value={assignedUserId}
								onChange={(e) => setAssignedUserId(e.target.value)}
								className="w-full px-3 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
							>
								<option value="">Unassigned Realm</option>
								{users.map((u) => (
									<option key={u.id} value={u.id}>
										{u.name || u.email}
									</option>
								))}
							</select>
						</div>

						{/* Due Date Picker */}
						<div className="space-y-1">
							<label className="flex items-center gap-1.5 text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
								<Calendar size={14} className="text-[#D7B05C]" />
								<span>Target Deadline</span>
							</label>
							<input
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
								className="w-full px-3 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
							/>
						</div>
					</div>

					{/* Modal Footer Controls */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t border-[#4A2C1D]">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-[#8F6236] bg-[#15100C] text-[#D7B05C] hover:text-white rounded-xs text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer"
						>
							Cancel
						</button>

						<button
							type="submit"
							disabled={isLoading}
							className="inline-flex items-center gap-2 px-6 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.15em] rounded-xs shadow-lg hover:border-[#FFF5D6] hover:shadow-[0_0_20px_rgba(215,176,92,0.4)] transition-all cursor-pointer disabled:opacity-50"
						>
							{isLoading ? (
								<>
									<Loader2 className="animate-spin text-[#D7B05C]" size={16} />
									<span>Sealing Decree...</span>
								</>
							) : (
								<>
									<Shield size={16} className="text-[#D7B05C]" />
									<span>Save Changes</span>
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

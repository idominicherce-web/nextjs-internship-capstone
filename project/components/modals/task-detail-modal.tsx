"use client";

import {
	Calendar,
	CheckCircle,
	Columns,
	Loader2,
	Scroll,
	Shield,
	ShieldAlert,
	User as UserIcon,
	X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { updateTask, updateTaskPosition } from "@/actions/tasks";
import {
	type PriorityLevel,
	TaskPriorityBadge,
} from "@/components/kanban/task/task-priority-badge";

interface Task {
	id: string;
	title: string;
	description: string | null;
	listId: string;
	dueDate?: Date | string | null;
	userId?: string | null;
	priority?: PriorityLevel | string | null;
}

interface UserOption {
	id: string;
	name: string | null;
	email: string;
}

interface ListOption {
	id: string;
	name: string;
}

interface TaskDetailModalProps {
	task: Task | null;
	projectId: string;
	isOpen: boolean;
	users?: UserOption[];
	lists?: ListOption[];
	onClose: () => void;
}

export function TaskDetailModal({
	task,
	projectId,
	isOpen,
	users = [],
	lists = [],
	onClose,
}: TaskDetailModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [assignedUserId, setAssignedUserId] = useState<string>("");
	const [priority, setPriority] = useState<string>("Medium");
	const [selectedListId, setSelectedListId] = useState<string>("");
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
			setPriority(task.priority || "Medium");
			setSelectedListId(task.listId || "");
		}
	}, [task]);

	if (!isOpen || !task) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		setIsLoading(true);
		setSuccessMsg("");

		// 1. Move column if target list changed
		if (selectedListId && selectedListId !== task.listId) {
			await updateTaskPosition(task.id, selectedListId, 0, projectId);
		}

		// 2. Update task details
		const result = await updateTask(task.id, projectId, {
			title: title.trim(),
			description: description.trim() || null,
			dueDate: dueDate ? new Date(dueDate) : null,
			userId: assignedUserId || null,
			priority: priority || "Medium",
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
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-xs font-serif text-[#F8EEDB]">
			<div className="relative w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[85dvh] flex flex-col rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden">
				{/* Forged Brass Corner Brackets */}
				<div className="absolute left-1 top-1 w-3 h-3 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute right-1 top-1 w-3 h-3 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />

				{/* Fixed Modal Header */}
				<div className="flex-none flex items-center justify-between p-3.5 sm:p-5 border-b-2 border-[#4A2C1D] bg-[#15100C]/90">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md">
							<Scroll size={18} />
						</div>
						<div>
							<div className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-[#D7B05C]">
								Objective Ledger •{" "}
								<span className="italic font-serif text-[#D7B05C]/70">
									Task Details
								</span>
							</div>
							<h2 className="text-base sm:text-lg font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wider">
								Edit Objective
							</h2>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="p-1.5 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
					>
						<X size={18} />
					</button>
				</div>

				{/* Scrollable Form Body */}
				<form
					onSubmit={handleSubmit}
					className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
				>
					{/* Success Alert Banner */}
					{successMsg && (
						<div className="rounded-xs bg-emerald-950/80 border border-emerald-600 p-2.5 text-xs font-sans font-bold text-emerald-300 flex items-center gap-2 shadow-inner">
							<CheckCircle size={16} className="text-emerald-400" />
							<span>{successMsg}</span>
						</div>
					)}

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
							className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
						/>
					</div>

					{/* Target Column / Stage Selector */}
					{lists.length > 0 && (
						<div className="space-y-1">
							<label className="flex items-center gap-1.5 text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
								<Columns size={14} className="text-[#D7B05C]" />
								<span>Quest Stage / Column</span>
							</label>
							<select
								value={selectedListId}
								onChange={(e) => setSelectedListId(e.target.value)}
								className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
							>
								{lists.map((l) => (
									<option key={l.id} value={l.id}>
										{l.name}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Description Input */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Mission Brief / Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							placeholder="Add tactical details..."
							className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner resize-none"
						/>
					</div>

					{/* Priority Selection */}
					<div className="space-y-1">
						<label className="flex items-center gap-1.5 text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							<ShieldAlert size={14} className="text-[#D7B05C]" />
							<span>Quest Priority</span>
						</label>
						<div className="flex flex-wrap items-center gap-2">
							{["Low", "Medium", "High", "Urgent"].map((p) => (
								<button
									key={p}
									type="button"
									onClick={() => setPriority(p)}
									className={`cursor-pointer transition-transform ${priority === p ? "scale-105 ring-2 ring-[#D7B05C]" : "opacity-60"}`}
								>
									<TaskPriorityBadge priority={p} />
								</button>
							))}
						</div>
					</div>

					{/* Grid: Assignee & Due Date */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
								<option value="">Unassigned</option>
								{users.map((u) => (
									<option key={u.id} value={u.id}>
										{u.name || u.email}
									</option>
								))}
							</select>
						</div>

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

					{/* Fixed Modal Footer */}
					<div className="flex-none flex items-center justify-end gap-3 pt-3 border-t border-[#4A2C1D]">
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
							className="inline-flex items-center gap-2 px-6 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.15em] rounded-xs shadow-lg hover:border-[#FFF5D6] transition-all cursor-pointer disabled:opacity-50"
						>
							{isLoading ? (
								<>
									<Loader2 className="animate-spin text-[#D7B05C]" size={16} />
									<span>Saving...</span>
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

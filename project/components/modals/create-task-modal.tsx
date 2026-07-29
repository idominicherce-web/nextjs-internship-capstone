"use client";

import { Compass, Loader2, Scroll, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { createTask } from "@/actions/tasks";

interface UserOption {
	id: string;
	name: string | null;
	email: string;
}

interface ListOption {
	id: string;
	name: string;
}

interface CreateTaskModalProps {
	projectId: string;
	isOpen: boolean;
	lists?: ListOption[];
	users?: UserOption[];
	onClose: () => void;
}

export function CreateTaskModal({
	projectId,
	isOpen,
	lists = [],
	users = [],
	onClose,
}: CreateTaskModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [listId, setListId] = useState("");
	const [assignedUserId, setAssignedUserId] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [priority, setPriority] = useState("Medium");
	const [isLoading, setIsLoading] = useState(false);

	// Lock body scroll when modal is open to prevent page scrolling underneath
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !listId) return;

		setIsLoading(true);

		// Inside handleSubmit in create-task-modal.tsx
		await createTask(null, {
			title: title.trim(),
			description: description.trim() || undefined,
			listId,
			projectId,
			dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
			userId: assignedUserId || undefined,
			priority,
		});

		setIsLoading(false);

		// Reset Form State & Dismiss Modal
		setTitle("");
		setDescription("");
		setDueDate("");
		setAssignedUserId("");
		setPriority("Medium");
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs font-serif text-[#F8EEDB]">
			<div className="relative w-[94vw] sm:max-w-lg max-h-[85dvh] flex flex-col rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden">
				{/* Forged Brass Corner Brackets */}
				<div className="absolute left-1 top-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
				<div className="absolute right-1 top-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />

				{/* Fixed Modal Header */}
				<div className="flex-none flex items-center justify-between p-3.5 sm:p-5 border-b-2 border-[#4A2C1D] bg-[#15100C]/90">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md">
							<Scroll size={18} />
						</div>
						<div>
							<div className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-[#D7B05C]">
								Royal Command
							</div>
							<h2 className="text-base sm:text-lg font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wider">
								Create Task Objective
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
					{/* Target Column / Stage Selector */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Target Stage / Column <span className="text-rose-400">*</span>
						</label>
						<select
							value={listId}
							onChange={(e) => setListId(e.target.value)}
							required
							className="w-full px-3.5 py-2.5 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
						>
							<option value="" disabled>
								Select Stage Column...
							</option>
							{lists.map((l) => (
								<option key={l.id} value={l.id}>
									{l.name}
								</option>
							))}
						</select>
					</div>

					{/* Title Input */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Objective Title <span className="text-rose-400">*</span>
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Fortify Front-End Infrastructure"
							required
							className="w-full px-3.5 py-2.5 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] shadow-inner"
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
							placeholder="Specify requirements and tactical deliverables..."
							className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] shadow-inner resize-none"
						/>
					</div>

					{/* Grid: Assignee & Priority */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
								Assigned Officer
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
							<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
								Target Deadline
							</label>
							<input
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
								className="w-full px-3 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
							/>
						</div>
					</div>

					{/* Fixed Modal Footer Controls */}
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
							disabled={isLoading || !title.trim() || !listId}
							className="inline-flex items-center gap-2 px-6 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.15em] rounded-xs shadow-lg hover:border-[#FFF5D6] transition-all cursor-pointer disabled:opacity-50"
						>
							{isLoading ? (
								<Loader2 className="animate-spin text-[#D7B05C]" size={16} />
							) : (
								<Compass size={16} className="text-[#D7B05C]" />
							)}
							<span>{isLoading ? "Dispatching..." : "Create Objective"}</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

"use client";

import {
	Calendar,
	Compass,
	Loader2,
	Scroll,
	User as UserIcon,
	X,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { type ActionResponse, createTask } from "@/actions/tasks";

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
	lists: ListOption[];
	users?: UserOption[];
	defaultListId?: string;
	isOpen: boolean;
	onClose: () => void;
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex items-center gap-2 px-6 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.15em] rounded-xs shadow-lg hover:border-[#FFF5D6] hover:shadow-[0_0_20px_rgba(215,176,92,0.4)] transition-all cursor-pointer disabled:opacity-50"
		>
			{pending ? (
				<Loader2 size={16} className="animate-spin text-[#D7B05C]" />
			) : (
				<Compass size={16} className="text-[#D7B05C]" />
			)}
			<span>{pending ? "Dispatching Decree..." : "Create Objective"}</span>
		</button>
	);
}

export function CreateTaskModal({
	projectId,
	lists,
	users = [],
	defaultListId,
	isOpen,
	onClose,
}: CreateTaskModalProps) {
	const [selectedListId, setSelectedListId] = useState(
		defaultListId || lists[0]?.id || "",
	);

	useEffect(() => {
		if (defaultListId) setSelectedListId(defaultListId);
		else if (lists.length > 0) setSelectedListId(lists[0].id);
	}, [defaultListId, lists]);

	const [state, formAction] = useActionState<ActionResponse, FormData>(
		createTask,
		{ success: false },
	);

	useEffect(() => {
		if (state.success) {
			onClose();
		}
	}, [state.success, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs font-serif text-[#F8EEDB]">
			<div className="relative w-full max-w-lg rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden">
				{/* Forged Corner Fittings */}
				<div className="absolute left-1 top-1 w-3.5 h-3.5 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute right-1 top-1 w-3.5 h-3.5 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute bottom-1 left-1 w-3.5 h-3.5 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute bottom-1 right-1 w-3.5 h-3.5 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />

				{/* Modal Header */}
				<div className="flex items-center justify-between border-b-2 border-[#4A2C1D] pb-4 mb-5">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md">
							<Scroll size={22} />
						</div>
						<div>
							<div className="text-[9px] font-sans font-black uppercase tracking-[0.25em] text-[#D7B05C]">
								War Room •{" "}
								<span className="italic font-serif text-[#D7B05C]/70">
									New Decree
								</span>
							</div>
							<h2 className="text-xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wider">
								Create Task Objective
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

				<form action={formAction} className="space-y-4">
					<input type="hidden" name="projectId" value={projectId} />

					{state.error && (
						<div className="p-3 rounded-xs border border-rose-600 bg-rose-950/80 text-rose-300 text-xs font-sans font-bold">
							{state.error}
						</div>
					)}

					{/* Target Column Select */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Target Stage / Column <span className="text-rose-400">*</span>
						</label>
						<select
							name="listId"
							value={selectedListId}
							onChange={(e) => setSelectedListId(e.target.value)}
							required
							className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
						>
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
							name="title"
							placeholder="e.g. Fortify Front-End Infrastructure"
							required
							autoFocus
							className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/70 focus:outline-none focus:border-[#D7B05C] shadow-inner"
						/>
					</div>

					{/* Description Textarea */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Mission Brief / Description
						</label>
						<textarea
							name="description"
							rows={3}
							placeholder="Specify requirements and tactical deliverables..."
							className="w-full px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/70 focus:outline-none focus:border-[#D7B05C] shadow-inner resize-none"
						/>
					</div>

					{/* Assignee & Due Date Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
						<div className="space-y-1">
							<label className="flex items-center gap-1.5 text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
								<UserIcon size={14} className="text-[#D7B05C]" />
								<span>Assigned Officer</span>
							</label>
							<select
								name="userId"
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
								name="dueDate"
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

						<SubmitButton />
					</div>
				</form>
			</div>
		</div>
	);
}

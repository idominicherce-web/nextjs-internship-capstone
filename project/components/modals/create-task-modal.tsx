"use client";

import { AlertCircle, CheckCircle2, Loader2, Scroll, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createTask } from "@/actions/tasks";
import { useNotificationStore } from "@/stores/use-notification-store";

interface CreateTaskModalProps {
	projectId: string;
	lists: { id: string; name: string }[];
	users?: { id: string; name: string | null; email: string }[];
	isOpen: boolean;
	onClose: () => void;
}

export function CreateTaskModal({
	projectId,
	lists,
	users = [],
	isOpen,
	onClose,
}: CreateTaskModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [listId, setListId] = useState("");
	const [userId, setUserId] = useState("");
	const [priority, setPriority] = useState<
		"Low" | "Medium" | "High" | "Urgent"
	>("Medium");
	const [dueDate, setDueDate] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	useEffect(() => {
		if (lists.length > 0 && !listId) {
			setListId(lists[0].id);
		}
	}, [lists, listId]);

	// Lock body scroll when active and listen to Escape key
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !listId || isLoading) return;

		setIsLoading(true);
		setError(null);

		try {
			const res = await createTask(null, {
				projectId,
				listId,
				title: title.trim(),
				description: description.trim() || undefined,
				userId: userId || undefined,
				priority,
				dueDate: dueDate ? dueDate : undefined,
			});

			if (res.success) {
				setIsSuccess(true);
				addNotification({
					title: "Royal Task Objective Commissioned",
					description: `'${title.trim()}' has been logged into the quest ledger.`,
					type: "task",
				});

				setTimeout(() => {
					setTitle("");
					setDescription("");
					setUserId("");
					setDueDate("");
					setIsSuccess(false);
					onClose();
				}, 1000);
			} else {
				setError(res.error || "Failed to create task objective.");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred while creating task.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-[100] h-screen w-screen bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-serif"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-lg rounded-xs border-2 border-[#8F6236] bg-[#1A120C] shadow-2xl relative my-auto overflow-hidden">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] p-3.5 sm:p-4 bg-[#15100C] shrink-0">
					<div className="flex items-center gap-2">
						<Scroll className="text-[#D7B05C]" size={20} />
						<h3 className="font-serif font-black text-sm sm:text-lg text-[#F8EEDB] uppercase tracking-wider">
							Create Task Objective
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-[#D7B05C]/60 hover:text-[#F8EEDB] transition-colors p-1 cursor-pointer"
					>
						<X size={18} />
					</button>
				</div>

				{/* Fixed Non-Scrollable Modal Form Body */}
				<form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
					{/* Target Stage Column */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
							Target Stage / Column <span className="text-rose-400">*</span>
						</label>
						<select
							value={listId}
							onChange={(e) => setListId(e.target.value)}
							required
							className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
						>
							<option value="" disabled>
								Select Stage Column...
							</option>
							{lists.map((list) => (
								<option key={list.id} value={list.id}>
									{list.name}
								</option>
							))}
						</select>
					</div>

					{/* Objective Title */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
							Objective Title <span className="text-rose-400">*</span>
						</label>
						<input
							type="text"
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Fortify Front-End Infrastructure"
							className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold placeholder-[#8F6236]/70 rounded-xs focus:outline-none focus:border-[#D7B05C]"
						/>
					</div>

					{/* Quest Brief / Description */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
							Quest Brief / Description
						</label>
						<textarea
							rows={2}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Specify requirements and tactical deliverables..."
							className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold placeholder-[#8F6236]/70 rounded-xs focus:outline-none focus:border-[#D7B05C] resize-none"
						/>
					</div>

					{/* Assigned Officer */}
					<div className="space-y-1">
						<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
							Assigned Officer
						</label>
						<select
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
							className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
						>
							<option value="">Unassigned</option>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.name || user.email}
								</option>
							))}
						</select>
					</div>

					{/* Priority & Due Date Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="space-y-1">
							<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
								Quest Priority
							</label>
							<select
								value={priority}
								onChange={(e) =>
									setPriority(
										e.target.value as "Low" | "Medium" | "High" | "Urgent",
									)
								}
								className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
							>
								<option value="Low">Low Priority</option>
								<option value="Medium">Medium Priority</option>
								<option value="High">High Priority</option>
								<option value="Urgent">Urgent Priority</option>
							</select>
						</div>

						<div className="space-y-1">
							<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
								Target Deadline
							</label>
							<input
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
								className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold rounded-xs focus:outline-none focus:border-[#D7B05C]"
							/>
						</div>
					</div>

					{/* Feedback Alerts */}
					{isSuccess && (
						<div className="p-2.5 rounded-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-sans">
							<CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
							<span>Task objective created successfully!</span>
						</div>
					)}

					{error && (
						<div className="p-2.5 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 font-sans">
							<AlertCircle size={15} className="text-rose-400 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{/* Modal Action Buttons */}
					<div className="flex items-center justify-end gap-3 pt-2.5 border-t border-[#4A2C1D]">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="px-4 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C]/80 hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors disabled:opacity-50 cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading || isSuccess}
							className="px-5 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
						>
							{isLoading ? (
								<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
							) : (
								<Scroll size={14} className="text-[#D7B05C]" />
							)}
							<span>{isLoading ? "Commissioning..." : "Create Objective"}</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

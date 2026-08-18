"use client";

import { AlertCircle, CheckCircle2, Loader2, Scroll, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createTask } from "@/actions/tasks";

interface ProjectOption {
	id: string;
	name: string;
	lists: { id: string; name: string }[];
}

interface CreateTaskModalProps {
	projectId?: string;
	lists?: { id: string; name: string }[];
	projects?: ProjectOption[];
	users?: { id: string; name: string | null; email: string }[];
	initialDueDate?: Date | string;
	isOpen: boolean;
	onClose: () => void;
}

export function CreateTaskModal({
	projectId: initialProjectId,
	lists: initialLists = [],
	projects = [],
	users = [],
	initialDueDate,
	isOpen,
	onClose,
}: CreateTaskModalProps) {
	const [selectedProjectId, setSelectedProjectId] = useState(
		initialProjectId || "",
	);
	const [availableLists, setAvailableLists] =
		useState<{ id: string; name: string }[]>(initialLists);

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

	useEffect(() => {
		if (initialDueDate) {
			const d = new Date(initialDueDate);
			if (!Number.isNaN(d.getTime())) {
				const year = d.getFullYear();
				const month = String(d.getMonth() + 1).padStart(2, "0");
				const day = String(d.getDate()).padStart(2, "0");
				setDueDate(`${year}-${month}-${day}`);
			}
		}
	}, [initialDueDate]);

	useEffect(() => {
		if (initialProjectId) {
			setSelectedProjectId(initialProjectId);
			setAvailableLists(initialLists);
		} else if (projects.length > 0 && !selectedProjectId) {
			setSelectedProjectId(projects[0].id);
			setAvailableLists(projects[0].lists);
		}
	}, [initialProjectId, initialLists, projects, selectedProjectId]);

	const handleProjectChange = (projId: string) => {
		setSelectedProjectId(projId);
		const foundProj = projects.find((p) => p.id === projId);
		if (foundProj && foundProj.lists.length > 0) {
			setAvailableLists(foundProj.lists);
			setListId(foundProj.lists[0].id);
		} else {
			setAvailableLists([]);
			setListId("");
		}
	};

	useEffect(() => {
		if (availableLists.length > 0 && !listId) {
			setListId(availableLists[0].id);
		}
	}, [availableLists, listId]);

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
		if (!selectedProjectId) {
			setError("Please select a target project.");
			return;
		}
		if (!title.trim() || !listId || isLoading) return;

		setIsLoading(true);
		setError(null);

		try {
			const res = await createTask(null, {
				projectId: selectedProjectId,
				listId,
				title: title.trim(),
				description: description.trim() || undefined,
				userId: userId || undefined,
				priority,
				dueDate: dueDate ? dueDate : undefined,
			});

			if (res.success) {
				setIsSuccess(true);
				setTimeout(() => {
					setTitle("");
					setDescription("");
					setUserId("");
					setDueDate("");
					setIsSuccess(false);
					onClose();
				}, 1000);
			} else {
				setError(res.error || "Failed to create task.");
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
				<div className="flex items-center justify-between border-b border-[#4A2C1D] p-3.5 sm:p-4 bg-[#15100C] shrink-0">
					<div className="flex items-center gap-2">
						<Scroll className="text-[#D7B05C]" size={20} />
						<h3 className="font-serif font-black text-sm sm:text-lg text-[#F8EEDB] uppercase tracking-wider">
							Create Task
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

				<form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
					{!initialProjectId && projects.length > 0 && (
						<div className="space-y-1">
							<label
								htmlFor="task-project-select"
								className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
							>
								Project <span className="text-rose-400">*</span>
							</label>
							<select
								id="task-project-select"
								value={selectedProjectId}
								onChange={(e) => handleProjectChange(e.target.value)}
								required
								className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
							>
								<option value="" disabled>
									Select Project...
								</option>
								{projects.map((proj) => (
									<option key={proj.id} value={proj.id}>
										{proj.name}
									</option>
								))}
							</select>
						</div>
					)}

					<div className="space-y-1">
						<label
							htmlFor="task-title-input"
							className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
						>
							Task Title <span className="text-rose-400">*</span>
						</label>
						<input
							id="task-title-input"
							type="text"
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. Implement API Endpoints"
							className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold placeholder-[#8F6236]/70 rounded-xs focus:outline-none focus:border-[#D7B05C]"
						/>
					</div>

					<div className="space-y-1">
						<label
							htmlFor="task-stage-select"
							className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
						>
							Column / Stage <span className="text-rose-400">*</span>
						</label>
						<select
							id="task-stage-select"
							value={listId}
							onChange={(e) => setListId(e.target.value)}
							required
							className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
						>
							<option value="" disabled>
								Select Stage Column...
							</option>
							{availableLists.map((list) => (
								<option key={list.id} value={list.id}>
									{list.name}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-1">
						<label
							htmlFor="task-description-textarea"
							className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
						>
							Description
						</label>
						<textarea
							id="task-description-textarea"
							rows={2}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Task notes and specifications..."
							className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold placeholder-[#8F6236]/70 rounded-xs focus:outline-none focus:border-[#D7B05C] resize-none"
						/>
					</div>

					<div className="space-y-1">
						<label
							htmlFor="task-assignee-select"
							className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
						>
							Assignee
						</label>
						<select
							id="task-assignee-select"
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

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div className="space-y-1">
							<label
								htmlFor="task-priority-select"
								className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
							>
								Priority
							</label>
							<select
								id="task-priority-select"
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
							<label
								htmlFor="task-due-date-input"
								className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
							>
								Due Date <span className="text-rose-400">*</span>
							</label>
							<input
								id="task-due-date-input"
								type="date"
								required
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
								className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] font-sans text-xs font-bold rounded-xs focus:outline-none focus:border-[#D7B05C]"
							/>
						</div>
					</div>

					{isSuccess && (
						<div className="p-2.5 rounded-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-sans">
							<CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
							<span>Task created successfully!</span>
						</div>
					)}

					{error && (
						<div className="p-2.5 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 font-sans">
							<AlertCircle size={15} className="text-rose-400 shrink-0" />
							<span>{error}</span>
						</div>
					)}

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
							<span>{isLoading ? "Creating..." : "Create Task"}</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

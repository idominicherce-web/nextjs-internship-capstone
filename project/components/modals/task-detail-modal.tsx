"use client";

import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	ChevronDown,
	Columns,
	Copy,
	Loader2,
	Scroll,
	Shield,
	ShieldAlert,
	User as UserIcon,
	X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { updateTask, updateTaskPosition } from "@/actions/tasks";
import { TaskCommentSection } from "@/components/kanban/task/task-comment-section";

interface Task {
	id: string;
	title: string;
	description: string | null;
	listId: string;
	dueDate?: Date | string | null;
	userId?: string | null;
	priority?: "Low" | "Medium" | "High" | "Urgent" | string | null;
	createdAt?: Date | string | null;
	updatedAt?: Date | string | null;
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
	const router = useRouter();
	const pathname = usePathname();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [assignedUserId, setAssignedUserId] = useState<string>("");
	const [priority, setPriority] = useState<string>("Medium");
	const [selectedListId, setSelectedListId] = useState<string>("");
	const [activeMobileTab, setActiveMobileTab] = useState<
		"details" | "chronicle"
	>("details");
	const [isLoading, setIsLoading] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const [copiedLink, setCopiedLink] = useState(false);

	useEffect(() => {
		if (task) {
			setTitle(task.title || "");
			setDescription(task.description || "");
			setDueDate(
				task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
			);
			setAssignedUserId(task.userId || "");
			const rawPriority = task.priority || "Medium";
			setPriority(rawPriority === "Urgent" ? "High" : rawPriority);
			setSelectedListId(task.listId || "");
		}
	}, [task]);

	useEffect(() => {
		if (isOpen && task) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen, task]);

	// Clean close handler stripping ?task=... from URL
	const handleClose = () => {
		onClose();
		// Overwrite history entry to prevent duplicate query parameter stack
		router.replace(pathname, { scroll: false });
	};

	if (!isOpen || !task) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		setIsLoading(true);
		setSuccessMsg("");

		if (selectedListId && selectedListId !== task.listId) {
			await updateTaskPosition(task.id, selectedListId, 0, projectId);
		}

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
				handleClose();
			}, 1000);
		}
	};

	const copyLinkToClipboard = () => {
		const url = new URL(window.location.href);
		url.searchParams.set("task", task.id);
		navigator.clipboard.writeText(url.toString());
		setCopiedLink(true);
		setTimeout(() => setCopiedLink(false), 1500);
	};

	return (
		<div className="fixed inset-0 z-[100] bg-[#100A07] lg:bg-black/85 lg:backdrop-blur-xs flex items-stretch lg:items-start justify-center overflow-hidden font-serif text-[#F8EEDB]">
			<div className="relative w-full h-full lg:w-[min(96vw,1600px)] lg:h-[min(92vh,1000px)] lg:my-auto flex flex-col lg:rounded-xs border-0 lg:border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden">
				<div className="hidden lg:block absolute left-1 top-1 z-30 w-3 h-3 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="hidden lg:block absolute right-1 top-1 z-30 w-3 h-3 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />

				<div className="sticky top-0 z-20 flex-none flex items-center justify-between px-3 lg:px-[clamp(1rem,2vw,2rem)] py-2 lg:py-3 border-b-2 border-[#4A2C1D] bg-[#15100C] shadow-md">
					<div className="flex items-center space-x-2 lg:space-x-3">
						<button
							type="button"
							onClick={handleClose}
							className="lg:hidden p-1 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
						>
							<ArrowLeft size={16} />
						</button>

						<div className="p-1.5 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md shrink-0 hidden lg:block">
							<Scroll size={18} />
						</div>
						<div className="flex items-center gap-1.5 sm:gap-3">
							<h2 className="text-xs sm:text-base lg:text-lg font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wider">
								Edit Objective
							</h2>
							<span className="px-1.5 py-0.5 rounded-xs bg-[#1A120C] border border-[#8F6236] text-[9px] font-sans font-extrabold text-[#D7B05C]">
								OBJ-{task.id.slice(0, 6).toUpperCase()}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={copyLinkToClipboard}
							className="px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-xs border border-[#8F6236] bg-[#1A120C] text-[#D7B05C] hover:text-white text-[9px] font-sans font-bold flex items-center gap-1 transition-colors cursor-pointer"
						>
							<Copy size={11} />
							<span>{copiedLink ? "Copied!" : "Copy Link"}</span>
						</button>
						<button
							type="button"
							onClick={handleClose}
							className="hidden lg:block p-1.5 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
						>
							<X size={20} />
						</button>
					</div>
				</div>

				<div className="flex lg:hidden border-b border-[#4A2C1D] bg-[#15100C] flex-none">
					<button
						type="button"
						onClick={() => setActiveMobileTab("details")}
						className={`flex-1 py-1.5 text-[11px] font-sans font-black uppercase tracking-wider text-center border-b-2 transition-colors ${
							activeMobileTab === "details"
								? "border-[#D7B05C] text-[#D7B05C] bg-[#2D1B10]/50"
								: "border-transparent text-[#D7B05C]/50"
						}`}
					>
						Objective Details
					</button>
					<button
						type="button"
						onClick={() => setActiveMobileTab("chronicle")}
						className={`flex-1 py-1.5 text-[11px] font-sans font-black uppercase tracking-wider text-center border-b-2 transition-colors ${
							activeMobileTab === "chronicle"
								? "border-[#D7B05C] text-[#D7B05C] bg-[#2D1B10]/50"
								: "border-transparent text-[#D7B05C]/50"
						}`}
					>
						Council Comments
					</button>
				</div>

				<div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] divide-y lg:divide-y-0 lg:divide-x divide-[#4A2C1D] overflow-hidden">
					<form
						onSubmit={handleSubmit}
						className={`p-2.5 sm:p-4 lg:p-[clamp(1rem,2vw,2rem)] flex flex-col justify-between overflow-hidden lg:overflow-y-auto space-y-2 lg:space-y-4 scrollbar-thin scrollbar-thumb-[#8F6236] ${
							activeMobileTab === "chronicle" ? "hidden lg:flex" : "flex"
						}`}
					>
						<div className="space-y-2 lg:space-y-4">
							{successMsg && (
								<div className="rounded-xs bg-emerald-950/80 border border-emerald-600 p-2 text-xs font-sans font-bold text-emerald-300 flex items-center gap-2 shadow-inner">
									<CheckCircle size={14} className="text-emerald-400" />
									<span>{successMsg}</span>
								</div>
							)}

							<div className="space-y-1">
								<div className="flex items-center justify-between text-[9px] font-sans font-bold text-[#D7B05C]/60 uppercase tracking-wider">
									<span>Objective Headline</span>
									<span>Required *</span>
								</div>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									placeholder="Objective title..."
									className="w-full px-2.5 py-1.5 lg:px-3.5 lg:py-2.5 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs sm:text-sm lg:text-base font-serif font-black text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
								/>
							</div>

							<div className="p-2 lg:p-[clamp(0.75rem,1.5vw,1.25rem)] rounded-xs border border-[#8F6236]/50 bg-[#15100C]/70 space-y-1.5">
								<div className="text-[9px] font-sans font-black uppercase tracking-[0.15em] text-[#D7B05C] border-b border-[#4A2C1D] pb-0.5">
									Quest Brief
								</div>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Add tactical details..."
									className="w-full px-2.5 py-1 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-[11px] sm:text-xs font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner h-14 sm:h-20 lg:min-h-28 lg:max-h-[30vh] resize-none"
								/>
							</div>

							<div className="p-2 lg:p-[clamp(0.75rem,1.5vw,1.25rem)] rounded-xs border border-[#8F6236]/50 bg-[#15100C]/70 space-y-2">
								<div className="text-[9px] font-sans font-black uppercase tracking-[0.15em] text-[#D7B05C] border-b border-[#4A2C1D] pb-0.5">
									Tactical Parameters
								</div>

								<div className="grid gap-2 grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
									{lists.length > 0 && (
										<div className="space-y-0.5">
											<label className="flex items-center gap-1 text-[10px] sm:text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
												<Columns size={12} />
												<span>Stage</span>
											</label>
											<div className="relative flex items-center">
												<select
													value={selectedListId}
													onChange={(e) => setSelectedListId(e.target.value)}
													className="w-full appearance-none pl-2 pr-6 py-1 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-[11px] font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner cursor-pointer"
												>
													{lists.map((l) => (
														<option key={l.id} value={l.id}>
															{l.name}
														</option>
													))}
												</select>
												<ChevronDown
													size={14}
													className="absolute right-2 text-[#1A120C] pointer-events-none"
												/>
											</div>
										</div>
									)}

									<div className="space-y-0.5">
										<label className="flex items-center gap-1 text-[10px] sm:text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
											<ShieldAlert size={12} />
											<span>Priority</span>
										</label>

										<div className="hidden sm:grid grid-cols-3 gap-0.5 p-0.5 bg-[#1A120C] border border-[#8F6236] rounded-xs">
											{[
												{ label: "Low", icon: "⚔" },
												{ label: "Medium", icon: "🛡" },
												{ label: "High", icon: "⚡" },
											].map((p) => {
												const active = priority === p.label;
												return (
													<button
														key={p.label}
														type="button"
														onClick={() => setPriority(p.label)}
														className={`py-1 text-[9px] font-sans font-black uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
															active
																? "bg-[#D7B05C] text-[#1A120C] shadow-md font-extrabold scale-102"
																: "text-[#D7B05C]/60 hover:text-white hover:bg-[#2D1B10]"
														}`}
													>
														<span>{p.icon}</span>
														<span>{p.label}</span>
													</button>
												);
											})}
										</div>
									</div>

									<div className="space-y-0.5">
										<label className="flex items-center gap-1 text-[10px] sm:text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
											<UserIcon size={12} />
											<span>Assigned Officer</span>
										</label>
										<div className="relative flex items-center">
											<select
												value={assignedUserId}
												onChange={(e) => setAssignedUserId(e.target.value)}
												className="w-full appearance-none pl-2 pr-6 py-1 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-[11px] font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner cursor-pointer"
											>
												<option value="">Unassigned</option>
												{users.map((u) => (
													<option key={u.id} value={u.id}>
														{u.name || u.email}
													</option>
												))}
											</select>
											<ChevronDown
												size={14}
												className="absolute right-2 text-[#1A120C] pointer-events-none"
											/>
										</div>
									</div>

									<div className="space-y-0.5">
										<label className="flex items-center gap-1 text-[10px] sm:text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
											<Calendar size={12} />
											<span>Target Deadline</span>
										</label>
										<input
											type="date"
											value={dueDate}
											onChange={(e) => setDueDate(e.target.value)}
											className="w-full px-2 py-1 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-[11px] font-sans font-extrabold text-[#1A120C] focus:outline-none focus:border-[#D7B05C] shadow-inner"
										/>
									</div>
								</div>
							</div>
						</div>

						<button id="modal-submit-btn" type="submit" className="hidden" />
					</form>

					<div
						className={`p-3 lg:p-[clamp(1rem,2vw,2rem)] bg-[#15100C]/50 flex flex-col justify-between overflow-hidden ${
							activeMobileTab === "details" ? "hidden lg:flex" : "flex"
						}`}
					>
						<TaskCommentSection
							taskId={task.id}
							projectId={projectId}
							taskTitle={task.title}
						/>
					</div>
				</div>

				<div className="sticky bottom-0 z-20 flex-none flex items-center justify-end gap-2 sm:gap-3 px-3 lg:px-[clamp(1rem,2vw,2rem)] py-2 lg:py-3 border-t-2 border-[#4A2C1D] bg-[#15100C] shadow-2xl">
					<button
						type="button"
						onClick={handleClose}
						className="flex-1 max-w-[160px] py-1.5 lg:py-2 border border-[#8F6236] bg-[#15100C] text-[#D7B05C] hover:text-white rounded-xs text-[11px] sm:text-xs font-sans font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={() => {
							const submitBtn = document.getElementById(
								"modal-submit-btn",
							) as HTMLButtonElement;
							submitBtn?.click();
						}}
						disabled={isLoading}
						className="flex-1 max-w-[160px] inline-flex items-center justify-center gap-1.5 py-1.5 lg:py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] rounded-xs shadow-lg hover:border-[#FFF5D6] transition-all cursor-pointer disabled:opacity-50"
					>
						{isLoading ? (
							<>
								<Loader2 className="animate-spin text-[#D7B05C]" size={14} />
								<span>Saving...</span>
							</>
						) : (
							<>
								<Shield size={14} className="text-[#D7B05C]" />
								<span>Save Changes</span>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

"use client";

import {
	AlertTriangle,
	Calendar,
	CheckCircle2,
	Clock,
	ExternalLink,
	Folder,
	Shield,
	User,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface ModalTaskItem {
	id: string;
	title: string;
	projectName: string;
	projectSlug: string;
	dueDate: Date | string | null;
	assigneeName?: string | null;
	priority?: string | null;
}

interface TaskListModalProps {
	isOpen: boolean;
	onClose: () => void;
	categoryTitle: string;
	categoryType: "completed" | "active" | "overdue";
	tasks: ModalTaskItem[];
}

export function TaskListModal({
	isOpen,
	onClose,
	categoryTitle,
	categoryType,
	tasks,
}: TaskListModalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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

	if (!isOpen || !mounted) return null;

	const getCategoryBadge = () => {
		switch (categoryType) {
			case "completed":
				return {
					icon: CheckCircle2,
					color: "text-emerald-400 bg-emerald-950/80 border-emerald-700",
					badgeText: "Completed Dispatches",
				};
			case "active":
				return {
					icon: Clock,
					color: "text-sky-400 bg-sky-950/80 border-sky-700",
					badgeText: "Active Operations",
				};
			case "overdue":
				return {
					icon: AlertTriangle,
					color: "text-rose-400 bg-rose-950/80 border-rose-700",
					badgeText: "Critical Deadlines Overdue",
				};
		}
	};

	const badge = getCategoryBadge();
	const Icon = badge.icon;

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-[99999] h-screen w-screen bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-serif animate-in fade-in duration-150"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-2xl rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-5 sm:p-6 shadow-2xl space-y-4 relative my-auto text-[#F8EEDB]">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3.5">
					<div className="flex items-center gap-2.5">
						<div
							className={`p-1.5 rounded-xs border flex items-center justify-center ${badge.color}`}
						>
							<Icon size={18} />
						</div>
						<div>
							<span className="block text-[9px] font-sans font-black uppercase tracking-widest text-[#D7B05C]">
								{badge.badgeText}
							</span>
							<h2 className="font-serif font-black text-base sm:text-lg text-[#F8EEDB] uppercase tracking-wider">
								{categoryTitle} ({tasks.length})
							</h2>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="text-[#D7B05C]/70 hover:text-[#F8EEDB] transition-colors p-1 cursor-pointer"
					>
						<X size={18} />
					</button>
				</div>

				{/* Task List Items */}
				{tasks.length === 0 ? (
					<div className="p-8 border border-dashed border-[#8F6236]/40 bg-[#15100C] text-center rounded-xs space-y-2">
						<Shield size={28} className="mx-auto text-[#D7B05C]/40" />
						<p className="font-serif italic text-xs text-[#D7B05C]">
							No tasks currently recorded under this category.
						</p>
					</div>
				) : (
					<div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-[#8F6236] scrollbar-track-[#15100C]">
						{tasks.map((task) => (
							<div
								key={task.id}
								className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C] hover:border-[#D7B05C]/60 transition-colors shadow-xs flex items-center justify-between gap-3"
							>
								<div className="space-y-1 min-w-0">
									<div className="flex items-center gap-2 flex-wrap">
										<span className="font-serif font-bold text-xs sm:text-sm text-[#F8EEDB] truncate">
											{task.title}
										</span>
										{task.priority && (
											<span className="px-1.5 py-0.5 rounded-xs bg-[#2D1B10] border border-[#8F6236]/60 text-[9px] font-sans font-extrabold uppercase text-[#D7B05C]">
												{task.priority}
											</span>
										)}
									</div>

									<div className="flex items-center gap-3 text-[10px] font-sans text-[#D7B05C]/70 flex-wrap">
										<span className="flex items-center gap-1">
											<Folder size={11} className="text-[#D7B05C]" />
											{task.projectName}
										</span>

										{task.assigneeName && (
											<span className="flex items-center gap-1">
												<User size={11} className="text-[#D7B05C]" />
												{task.assigneeName}
											</span>
										)}

										{task.dueDate && (
											<span className="flex items-center gap-1 font-mono">
												<Calendar size={11} className="text-[#D7B05C]" />
												{new Date(task.dueDate).toLocaleDateString()}
											</span>
										)}
									</div>
								</div>

								<Link
									href={`/projects/${task.projectSlug}?task=${task.id}`}
									onClick={onClose}
									className="px-2.5 py-1.5 rounded-xs border border-[#8F6236] bg-[#2D1B10] hover:border-[#D7B05C] text-[#D7B05C] hover:text-white text-[10px] font-sans font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
								>
									<span>View Task</span>
									<ExternalLink size={11} />
								</Link>
							</div>
						))}
					</div>
				)}

				{/* Footer */}
				<div className="flex items-center justify-end pt-3 border-t border-[#4A2C1D]">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-1.5 border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C] hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors cursor-pointer"
					>
						Close Breakdown
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}

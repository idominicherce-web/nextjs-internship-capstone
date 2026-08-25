"use client";

import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
	type ModalTaskItem,
	TaskListModal,
} from "@/components/analytics/task-list-modal";

interface IntelligenceStatsProps {
	overallEfficiency: number;
	completedTasksCount: number;
	totalTasksCount: number;
	inProgressTasksCount: number;
	overdueTasksCount: number;
	completedTasksList?: ModalTaskItem[];
	activeTasksList?: ModalTaskItem[];
	overdueTasksList?: ModalTaskItem[];
}

export function IntelligenceStats({
	overallEfficiency,
	completedTasksCount,
	totalTasksCount,
	inProgressTasksCount,
	overdueTasksCount,
	completedTasksList = [],
	activeTasksList = [],
	overdueTasksList = [],
}: IntelligenceStatsProps) {
	const [activeModal, setActiveModal] = useState<{
		isOpen: boolean;
		title: string;
		type: "completed" | "active" | "overdue";
		tasks: ModalTaskItem[];
	}>({
		isOpen: false,
		title: "",
		type: "active",
		tasks: [],
	});

	const handleCardClick = (
		title: string,
		type: "completed" | "active" | "overdue",
		tasks: ModalTaskItem[],
	) => {
		setActiveModal({
			isOpen: true,
			title,
			type,
			tasks,
		});
	};

	const stats = [
		{
			title: "Completion Rate",
			value: `${overallEfficiency}%`,
			description: "Overall completion across all work.",
			icon: TrendingUp,
			color: "text-amber-400",
			borderColor: "border-[#8F6236]/60",
			clickable: false,
		},
		{
			title: "Completed Tasks",
			value: `${completedTasksCount} / ${totalTasksCount}`,
			description: "Click to inspect completed dispatches.",
			icon: CheckCircle2,
			color: "text-emerald-400",
			borderColor: "border-emerald-800/60 hover:border-emerald-500",
			clickable: true,
			onClick: () =>
				handleCardClick(
					"Completed Tasks Breakdown",
					"completed",
					completedTasksList,
				),
		},
		{
			title: "Active Tasks",
			value: `${inProgressTasksCount}`,
			description: "Click to inspect active operations.",
			icon: Clock,
			color: "text-sky-400",
			borderColor: "border-sky-800/60 hover:border-sky-500",
			clickable: true,
			onClick: () =>
				handleCardClick("Active Tasks Breakdown", "active", activeTasksList),
		},
		{
			title: "Overdue Tasks",
			value: `${overdueTasksCount}`,
			description: "Click to inspect overdue deadlines.",
			icon: AlertTriangle,
			color: overdueTasksCount > 0 ? "text-rose-400" : "text-[#D7B05C]",
			borderColor:
				overdueTasksCount > 0
					? "border-rose-800/60 hover:border-rose-500"
					: "border-[#8F6236]/60 hover:border-[#D7B05C]",
			clickable: true,
			onClick: () =>
				handleCardClick("Overdue Tasks Breakdown", "overdue", overdueTasksList),
		},
	];

	return (
		<>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<div
							key={stat.title}
							onClick={stat.clickable ? stat.onClick : undefined}
							className={`p-3.5 sm:p-4 rounded-xs border-2 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl space-y-1.5 sm:space-y-2 relative min-w-0 transition-all ${
								stat.borderColor
							} ${
								stat.clickable
									? "cursor-pointer hover:scale-[1.02] hover:shadow-2xl"
									: ""
							}`}
						>
							<div className="flex justify-between items-center gap-1">
								<span className="text-[9px] sm:text-[10px] font-sans font-black uppercase tracking-wider text-[#D7B05C] truncate">
									{stat.title}
								</span>
								<Icon size={16} className={`${stat.color} shrink-0`} />
							</div>

							<p
								className={`text-xl sm:text-2xl font-serif font-black ${stat.color} truncate`}
							>
								{stat.value}
							</p>

							<p className="text-[10px] sm:text-[11px] font-sans text-[#D7B05C]/70 italic line-clamp-1">
								{stat.description}
							</p>
						</div>
					);
				})}
			</div>

			<TaskListModal
				isOpen={activeModal.isOpen}
				onClose={() => setActiveModal((prev) => ({ ...prev, isOpen: false }))}
				categoryTitle={activeModal.title}
				categoryType={activeModal.type}
				tasks={activeModal.tasks}
			/>
		</>
	);
}

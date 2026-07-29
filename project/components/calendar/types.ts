export type TaskType =
	| "deadline"
	| "meeting"
	| "completed"
	| "reminder"
	| "milestone";

export interface CalendarTask {
	id: string;
	title: string;
	projectName: string;
	dueDate: Date;
	type: TaskType;
	isCompleted: boolean;
	priority?: "Low" | "Medium" | "High" | "Urgent";
	assignedTo?: string;
	time?: string;
}

export const TASK_TYPE_CONFIG: Record<
	TaskType,
	{
		label: string;
		color: string;
		bg: string;
		border: string;
		icon: string;
		badge: string;
	}
> = {
	deadline: {
		label: "Deadline",
		color: "text-red-400",
		bg: "bg-red-950/80",
		border: "border-red-600/60",
		icon: "⚔",
		badge: "bg-red-500",
	},
	meeting: {
		label: "Meeting",
		color: "text-sky-300",
		bg: "bg-sky-950/80",
		border: "border-sky-600/60",
		icon: "📜",
		badge: "bg-sky-500",
	},
	completed: {
		label: "Completed",
		color: "text-emerald-300",
		bg: "bg-emerald-950/80",
		border: "border-emerald-600/60",
		icon: "🛡️",
		badge: "bg-emerald-500",
	},
	reminder: {
		label: "Reminder",
		color: "text-amber-300",
		bg: "bg-amber-950/80",
		border: "border-amber-600/60",
		icon: "⏳",
		badge: "bg-amber-500",
	},
	milestone: {
		label: "Milestone",
		color: "text-purple-300",
		bg: "bg-purple-950/80",
		border: "border-purple-600/60",
		icon: "🚩",
		badge: "bg-purple-500",
	},
};

export const PROJECT_RIBBONS: Record<string, string> = {
	"Project Alpha": "border-l-sky-500",
	"Project Phoenix": "border-l-red-500",
	"Internal Tools": "border-l-emerald-500",
	Default: "border-l-[#D7B05C]",
};

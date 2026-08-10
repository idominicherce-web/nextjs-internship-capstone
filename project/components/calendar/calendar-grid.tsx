"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import type { CalendarTask, TaskType } from "./types";

interface CalendarGridProps {
	tasks: CalendarTask[];
}

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MOBILE_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const typeColorMap: Record<
	TaskType,
	{ bg: string; border: string; dot: string }
> = {
	deadline: {
		bg: "bg-rose-500",
		border: "border-rose-600/60",
		dot: "bg-rose-500",
	},
	meeting: {
		bg: "bg-amber-500",
		border: "border-amber-600/60",
		dot: "bg-amber-500",
	},
	completed: {
		bg: "bg-emerald-500",
		border: "border-emerald-600/60",
		dot: "bg-emerald-500",
	},
	reminder: {
		bg: "bg-amber-400",
		border: "border-amber-500/60",
		dot: "bg-amber-400",
	},
	milestone: {
		bg: "bg-purple-500",
		border: "border-purple-600/60",
		dot: "bg-purple-500",
	},
};

function getDateKey(date: Date) {
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, "0"),
		String(date.getDate()).padStart(2, "0"),
	].join("-");
}

function isSameDate(a: Date, b: Date) {
	return a.toDateString() === b.toDateString();
}

export function CalendarGrid({ tasks }: CalendarGridProps) {
	const today = useMemo(() => new Date(), []);
	const [currentDate, setCurrentDate] = useState(() => new Date());
	const [selectedDate, setSelectedDate] = useState(() => new Date());

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	const monthName = currentDate.toLocaleString("default", { month: "long" });

	const tasksByDate = useMemo(() => {
		const map = new Map<string, CalendarTask[]>();
		for (const task of tasks) {
			const key = getDateKey(new Date(task.dueDate));
			const existing = map.get(key);
			if (existing) existing.push(task);
			else map.set(key, [task]);
		}
		return map;
	}, [tasks]);

	const calendarDays = useMemo(() => {
		const days: { date: Date; isCurrentMonth: boolean }[] = [];
		const firstDayOfMonth = new Date(year, month, 1);
		const firstDayOfWeek = firstDayOfMonth.getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		for (let i = firstDayOfWeek; i > 0; i--) {
			days.push({
				date: new Date(year, month, 1 - i),
				isCurrentMonth: false,
			});
		}

		for (let day = 1; day <= daysInMonth; day++) {
			days.push({ date: new Date(year, month, day), isCurrentMonth: true });
		}

		const remainder = days.length % 7;
		if (remainder !== 0) {
			const remaining = 7 - remainder;
			for (let day = 1; day <= remaining; day++) {
				days.push({
					date: new Date(year, month + 1, day),
					isCurrentMonth: false,
				});
			}
		}

		return days;
	}, [year, month]);

	const selectedDateKey = getDateKey(selectedDate);
	const selectedDayTasks = tasksByDate.get(selectedDateKey) ?? [];

	const handlePreviousMonth = () => {
		const nextDate = new Date(year, month - 1, 1);
		setCurrentDate(nextDate);
		setSelectedDate(nextDate);
	};

	const handleNextMonth = () => {
		const nextDate = new Date(year, month + 1, 1);
		setCurrentDate(nextDate);
		setSelectedDate(nextDate);
	};

	const handleSelectDate = (date: Date) => {
		setSelectedDate(date);
		if (date.getMonth() !== month || date.getFullYear() !== year) {
			setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
		}
	};

	const formatShortDate = (date: Date) => {
		return `${date.getDate()} ${date
			.toLocaleString("default", { month: "short" })
			.toUpperCase()}`;
	};

	return (
		<div className="w-full min-w-0 space-y-4">
			{/* DESKTOP CALENDAR GRID (md and above) */}
			<div className="hidden md:block w-full rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-5 shadow-2xl">
				{/* Desktop Header */}
				<div className="flex items-center justify-between border-b border-[#8F6236]/30 pb-4">
					<h2 className="font-serif text-xl font-black uppercase tracking-widest text-[#D7B05C]">
						{monthName} {year}
					</h2>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handlePreviousMonth}
							className="flex h-9 w-9 items-center justify-center rounded-xs border border-[#8F6236] bg-[#0F0B08] text-[#D7B05C] hover:border-[#D7B05C] cursor-pointer"
							aria-label="Previous month"
						>
							<ChevronLeft size={18} />
						</button>
						<button
							type="button"
							onClick={handleNextMonth}
							className="flex h-9 w-9 items-center justify-center rounded-xs border border-[#8F6236] bg-[#0F0B08] text-[#D7B05C] hover:border-[#D7B05C] cursor-pointer"
							aria-label="Next month"
						>
							<ChevronRight size={18} />
						</button>
						<div className="ml-1 rounded-xs border border-[#8F6236]/40 bg-[#0F0B08] px-3 py-2 text-[10px] font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Month
						</div>
					</div>
				</div>

				{/* Desktop Weekday Labels */}
				<div className="mt-4 grid grid-cols-7 gap-2 border-b border-[#8F6236]/20 pb-2 text-center">
					{DAYS_OF_WEEK.map((day) => (
						<span
							key={day}
							className="text-[10px] font-sans font-black tracking-wider text-[#D7B05C]"
						>
							{day}
						</span>
					))}
				</div>

				{/* Desktop Month Grid */}
				<div className="mt-2 grid grid-cols-7 gap-2">
					{calendarDays.map(({ date, isCurrentMonth }) => {
						const dateKey = getDateKey(date);
						const dayTasks = tasksByDate.get(dateKey) ?? [];
						const isSelected = isSameDate(selectedDate, date);
						const isToday = isSameDate(today, date);

						return (
							<button
								type="button"
								key={`desktop-${dateKey}`}
								onClick={() => handleSelectDate(date)}
								className={[
									"group flex min-h-[100px] min-w-0 flex-col justify-between rounded-xs border p-2 text-left transition-all cursor-pointer relative",
									!isCurrentMonth
										? "border-[#8F6236]/20 bg-[#0F0B08]/40 text-[#F8EEDB]/30"
										: isSelected
											? "border-[#D7B05C] bg-[#FAF0D7] text-[#1A120C] shadow-md ring-2 ring-[#D7B05C]"
											: isToday
												? "border-[#D7B05C] bg-[#2A1D13] text-[#F8EEDB] ring-1 ring-[#D7B05C]/70"
												: "border-[#8F6236]/50 bg-[#FAF0D7]/90 text-[#1A120C] hover:border-[#D7B05C]",
								].join(" ")}
							>
								<div className="flex items-center justify-between w-full">
									<span className="font-serif text-xs font-black">
										{date.getDate()}
									</span>
									{isToday && (
										<span className="px-1 py-0.5 rounded-xs bg-[#D7B05C] text-[#1A120C] text-[8px] font-sans font-extrabold uppercase tracking-tighter">
											Today
										</span>
									)}
								</div>

								<div className="w-full min-w-0 space-y-1">
									{dayTasks.slice(0, 3).map((task) => (
										<div
											key={task.id}
											className="w-full min-w-0 truncate rounded-xs border border-[#8F6236] bg-[#1A120C] px-1.5 py-0.5 text-[9px] font-sans font-medium text-[#D7B05C]"
										>
											{task.title}
										</div>
									))}
									{dayTasks.length > 3 && (
										<div className="text-[8px] font-sans font-black text-[#8F6236]">
											+{dayTasks.length - 3} more
										</div>
									)}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* MOBILE CALENDAR (Samsung-Inspired Compact) */}
			<div className="block w-full min-w-0 md:hidden space-y-3">
				<div className="w-full min-w-0 overflow-hidden rounded-xs border border-[#8F6236]/50 bg-[#1A120C]">
					<div className="flex items-center justify-between px-2 py-2">
						<button
							type="button"
							onClick={handlePreviousMonth}
							className="flex h-8 w-8 items-center justify-center rounded-full text-[#D7B05C]"
							aria-label="Previous month"
						>
							<ChevronLeft size={18} />
						</button>
						<h2 className="font-serif text-sm font-black uppercase tracking-wider text-[#F8EEDB]">
							{monthName} {year}
						</h2>
						<button
							type="button"
							onClick={handleNextMonth}
							className="flex h-8 w-8 items-center justify-center rounded-full text-[#D7B05C]"
							aria-label="Next month"
						>
							<ChevronRight size={18} />
						</button>
					</div>

					<div className="grid grid-cols-7 border-y border-[#8F6236]/30 bg-[#0F0B08]/60">
						{MOBILE_DAYS.map((day, idx) => (
							<div
								key={`${day}-${idx}`}
								className="py-1.5 text-center text-[10px] font-sans font-black text-[#D7B05C]/70"
							>
								{day}
							</div>
						))}
					</div>

					<div className="grid grid-cols-7 gap-0 p-1">
						{calendarDays.map(({ date, isCurrentMonth }) => {
							const dateKey = getDateKey(date);
							const dayTasks = tasksByDate.get(dateKey) ?? [];
							const isSelected = isSameDate(selectedDate, date);
							const isToday = isSameDate(today, date);

							return (
								<button
									type="button"
									key={`mobile-${dateKey}`}
									onClick={() => handleSelectDate(date)}
									className="flex flex-col items-center justify-start py-1 cursor-pointer"
								>
									<span
										className={[
											"flex aspect-square w-7 items-center justify-center rounded-full text-[11px] font-sans font-semibold transition-all",
											isSelected
												? "bg-[#D7B05C] font-black text-[#1A120C]"
												: isToday
													? "border border-[#D7B05C] font-bold text-[#D7B05C]"
													: isCurrentMonth
														? "text-[#F8EEDB]"
														: "text-[#F8EEDB]/25",
										].join(" ")}
									>
										{date.getDate()}
									</span>

									<div className="mt-1 flex min-h-1 items-center justify-center gap-0.5">
										{dayTasks.slice(0, 3).map((task) => {
											const style =
												typeColorMap[task.type] ?? typeColorMap.deadline;
											return (
												<span
													key={task.id}
													className={`h-1 w-1 rounded-full ${style.dot}`}
												/>
											);
										})}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Selected Day Agenda */}
				<div className="space-y-2">
					<div className="flex items-center justify-between border-b border-[#8F6236]/40 pb-1">
						<h3 className="font-serif text-xs font-black uppercase text-[#D7B05C]">
							{formatShortDate(selectedDate)}
						</h3>
						<span className="text-[9px] font-sans font-bold text-[#D7B05C]/70 uppercase">
							{selectedDayTasks.length} Quests
						</span>
					</div>

					{selectedDayTasks.length > 0 ? (
						<div className="space-y-1.5">
							{selectedDayTasks.map((task) => {
								const style = typeColorMap[task.type] ?? typeColorMap.deadline;
								return (
									<div
										key={task.id}
										className="rounded-xs border border-[#8F6236]/70 bg-[#0F0B08] p-2.5 text-xs"
									>
										<div className="flex items-center justify-between gap-2">
											<span className="font-serif font-bold text-[#F8EEDB] truncate">
												{task.title}
											</span>
											<span
												className={`px-1.5 py-0.5 text-[8px] font-black uppercase ${style.border} text-[#D7B05C] border bg-[#1A120C]`}
											>
												{task.type}
											</span>
										</div>
										<div className="mt-1 flex items-center justify-between text-[9px] text-[#D7B05C]/60">
											<span>{task.projectName}</span>
											<span className="flex items-center gap-1">
												<Clock size={10} /> {task.assignedTo}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="border border-dashed border-[#8F6236]/40 p-3 text-center text-xs italic text-[#D7B05C]/50">
							No quests scheduled for this date.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

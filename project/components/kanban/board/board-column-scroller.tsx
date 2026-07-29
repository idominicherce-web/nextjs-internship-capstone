"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import {
	KanbanColumn,
	type List,
} from "@/components/kanban/column/kanban-column";
import type { TaskCardData } from "@/components/kanban/task/task-card";

interface BoardColumnScrollerProps {
	lists: List[];
	projectId: string;
	taskInputs: Record<string, string>;
	setTaskInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	deleteList: (id: string, projectId: string) => void;
	handleAddTask: (listId: string) => void;
	onTaskClick: (task: TaskCardData) => void;
}

export function BoardColumnScroller({
	lists,
	projectId,
	taskInputs,
	setTaskInputs,
	deleteList,
	handleAddTask,
	onTaskClick,
}: BoardColumnScrollerProps) {
	const [activeColIdx, setActiveColIdx] = useState(0);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const isProgrammaticScroll = useRef(false);

	// Programmatic smooth scroll to target column index
	const scrollToColumn = (index: number) => {
		isProgrammaticScroll.current = true;
		setActiveColIdx(index);

		if (scrollContainerRef.current) {
			const columns = scrollContainerRef.current.children;
			if (columns[index]) {
				columns[index].scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "center",
				});
			}
		}

		// Unlock scroll listener after smooth-scroll animation completes
		setTimeout(() => {
			isProgrammaticScroll.current = false;
		}, 350);
	};

	// Keep Stage Indicator synced with manual finger swipes
	const handleScroll = () => {
		// Ignore intermediate scroll events during programmatic arrow transitions
		if (isProgrammaticScroll.current || !scrollContainerRef.current) return;

		const container = scrollContainerRef.current;
		const scrollLeft = container.scrollLeft;
		const columnWidth = container.firstElementChild
			? (container.firstElementChild as HTMLElement).offsetWidth + 16 // includes gap-4 (16px)
			: 1;

		const calculatedIndex = Math.round(scrollLeft / columnWidth);
		const clampedIndex = Math.max(
			0,
			Math.min(lists.length - 1, calculatedIndex),
		);

		if (clampedIndex !== activeColIdx) {
			setActiveColIdx(clampedIndex);
		}
	};

	return (
		<div className="space-y-3">
			{/* Mobile Deck Navigation Bar with Fixed CSS Grid */}
			{lists.length > 0 && (
				<div className="grid sm:hidden grid-cols-[36px_1fr_36px] items-center px-2 py-1.5 bg-[#15100C] border border-[#4A2C1D] rounded-xs text-xs font-sans font-bold text-[#D7B05C]">
					{/* Left Arrow Button */}
					<button
						type="button"
						disabled={activeColIdx === 0}
						onClick={() => scrollToColumn(Math.max(0, activeColIdx - 1))}
						className="flex items-center justify-center h-7 w-7 justify-self-start disabled:opacity-20 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
						title="Previous Stage"
					>
						<ChevronLeft size={18} />
					</button>

					{/* Center Fixed Title */}
					<span className="uppercase tracking-wider font-extrabold text-[11px] text-center truncate px-1">
						Stage {activeColIdx + 1} of {lists.length} •{" "}
						<span className="text-[#FFF5D6]">{lists[activeColIdx]?.name}</span>
					</span>

					{/* Right Arrow Button */}
					<button
						type="button"
						disabled={activeColIdx >= lists.length - 1}
						onClick={() =>
							scrollToColumn(Math.min(lists.length - 1, activeColIdx + 1))
						}
						className="flex items-center justify-center h-7 w-7 justify-self-end disabled:opacity-20 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
						title="Next Stage"
					>
						<ChevronRight size={18} />
					</button>
				</div>
			)}

			{/* Column Swiper Container */}
			<div
				ref={scrollContainerRef}
				onScroll={handleScroll}
				className="flex gap-4 overflow-x-auto pb-4 relative z-20 snap-x snap-mandatory scroll-smooth px-1 sm:px-0 scrollbar-thin scrollbar-thumb-[#8F6236]"
			>
				{lists.map((list) => (
					<KanbanColumn
						key={list.id}
						list={list}
						projectId={projectId}
						taskInputs={taskInputs}
						setTaskInputs={setTaskInputs}
						deleteList={deleteList}
						handleAddTask={handleAddTask}
						onTaskClick={onTaskClick}
					/>
				))}
			</div>
		</div>
	);
}

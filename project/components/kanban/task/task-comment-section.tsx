"use client";

import {
	Activity,
	Castle,
	Loader2,
	MessageSquare,
	Send,
	Trash2,
	User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { getTaskActivityLogs, type TaskActivityLog } from "@/actions/activity";
import {
	createTaskComment,
	deleteTaskComment,
	getTaskComments,
	type TaskCommentWithAuthor,
} from "@/actions/comments";
import { useNotificationStore } from "@/stores/use-notification-store";

interface TaskCommentSectionProps {
	taskId: string;
	projectId: string;
	taskTitle?: string;
}

type FeedFilter = "all" | "comments" | "activity";

export function TaskCommentSection({
	taskId,
	projectId,
	taskTitle,
}: TaskCommentSectionProps) {
	const [comments, setComments] = useState<TaskCommentWithAuthor[]>([]);
	const [activities, setActivities] = useState<TaskActivityLog[]>([]);
	const [activeFilter, setActiveFilter] = useState<FeedFilter>("all");
	const [newComment, setNewComment] = useState("");
	const [isFetching, setIsFetching] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	const fetchData = useCallback(async () => {
		setIsFetching(true);
		const [commentsRes, activityRes] = await Promise.all([
			getTaskComments(taskId),
			getTaskActivityLogs(taskId, taskTitle),
		]);

		if (commentsRes.success && commentsRes.data) {
			setComments(commentsRes.data);
		}
		if (activityRes.success && activityRes.data) {
			setActivities(activityRes.data);
		}
		setIsFetching(false);
	}, [taskId, taskTitle]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handlePostComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || isSubmitting) return;

		const textToSend = newComment.trim();
		setIsSubmitting(true);

		const result = await createTaskComment(taskId, projectId, textToSend);

		setIsSubmitting(false);

		if (result.success && result.data) {
			setComments((prev) => [result.data!, ...prev]);
			setNewComment("");

			addNotification({
				title: "Dispatch Comment Posted",
				description: "New commentary added to task objective.",
				type: "task",
			});
		}
	};

	const handleDelete = async (commentId: string) => {
		setDeletingId(commentId);
		const result = await deleteTaskComment(commentId, projectId);
		setDeletingId(null);

		if (result.success) {
			setComments((prev) => prev.filter((c) => c.id !== commentId));
		}
	};

	// Combine and sort dispatches and activity logs chronologically
	const combinedFeed = [
		...comments.map((c) => ({ ...c, feedType: "comment" as const })),
		...activities.map((a) => ({ ...a, feedType: "activity" as const })),
	].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	const filteredFeed = combinedFeed.filter((item) => {
		if (activeFilter === "comments") return item.feedType === "comment";
		if (activeFilter === "activity") return item.feedType === "activity";
		return true;
	});

	return (
		<div className="flex flex-col h-full min-h-0 space-y-2.5 font-serif">
			{/* Panel Filter Header */}
			<div className="flex items-center justify-between pb-2 border-b-2 border-[#4A2C1D] flex-none">
				<div className="flex items-center gap-1.5 text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
					<MessageSquare size={15} className="text-[#D7B05C]" />
					<span>Council Comments</span>
				</div>

				{/* Feed Filter Buttons */}
				<div className="flex items-center gap-1 p-0.5 bg-[#1A120C] border border-[#8F6236] rounded-xs">
					<button
						type="button"
						onClick={() => setActiveFilter("all")}
						className={`px-2 py-0.5 text-[9px] font-sans font-black uppercase tracking-wider rounded-xs cursor-pointer transition-colors ${
							activeFilter === "all"
								? "bg-[#D7B05C] text-[#1A120C]"
								: "text-[#D7B05C]/60 hover:text-white"
						}`}
					>
						All
					</button>
					<button
						type="button"
						onClick={() => setActiveFilter("comments")}
						className={`px-2 py-0.5 text-[9px] font-sans font-black uppercase tracking-wider rounded-xs cursor-pointer transition-colors ${
							activeFilter === "comments"
								? "bg-[#D7B05C] text-[#1A120C]"
								: "text-[#D7B05C]/60 hover:text-white"
						}`}
					>
						Comments ({comments.length})
					</button>
					<button
						type="button"
						onClick={() => setActiveFilter("activity")}
						className={`px-2 py-0.5 text-[9px] font-sans font-black uppercase tracking-wider rounded-xs cursor-pointer transition-colors ${
							activeFilter === "activity"
								? "bg-[#D7B05C] text-[#1A120C]"
								: "text-[#D7B05C]/60 hover:text-white"
						}`}
					>
						Log ({activities.length})
					</button>
				</div>
			</div>

			{/* Chronicle Feed Window */}
			<div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-[#8F6236]">
				{isFetching ? (
					<div className="flex items-center justify-center py-12 text-xs font-sans text-[#D7B05C]/70 gap-2">
						<Loader2 size={16} className="animate-spin text-[#D7B05C]" />
						<span>Gathering chronicle records...</span>
					</div>
				) : filteredFeed.length === 0 ? (
					<div className="p-6 border-2 border-dashed border-[#8F6236]/40 bg-[#15100C]/60 text-center rounded-xs my-auto space-y-2">
						<Castle size={26} className="mx-auto text-[#D7B05C]/40" />
						<h4 className="text-xs font-serif font-black text-[#F8EEDB]">
							No Records Found
						</h4>
						<p className="text-[10px] font-sans text-[#D7B05C]/60 max-w-xs mx-auto">
							No dispatches or activity entries match this selection.
						</p>
					</div>
				) : (
					filteredFeed.map((item) => {
						if (item.feedType === "activity") {
							return (
								<div
									key={item.id}
									className="px-3 py-2 rounded-xs border border-[#8F6236]/40 bg-[#15100C]/40 text-[11px] font-sans flex items-start gap-2 shadow-inner"
								>
									<Activity
										size={13}
										className="text-[#D7B05C] shrink-0 mt-0.5"
									/>
									<div className="min-w-0 flex-1 space-y-0.5">
										<div className="flex items-center justify-between text-[9px] text-[#D7B05C]/60">
											<span className="font-bold uppercase tracking-wider">
												{item.user?.name || "System Event"}
											</span>
											<span>
												{new Date(item.createdAt).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
										<p className="text-[#F8EEDB]/80 italic">
											{item.action}: {item.details || "Objective updated"}
										</p>
									</div>
								</div>
							);
						}

						return (
							<div
								key={item.id}
								className="p-2.5 sm:p-3 rounded-xs border border-[#8F6236]/60 bg-[#15100C]/80 text-xs font-sans space-y-1.5 relative group shadow-sm hover:border-[#D7B05C]/70 transition-colors"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-[#D7B05C] font-black text-xs">
										{item.author?.imageUrl ? (
											<Image
												src={item.author.imageUrl}
												alt={item.author.name || "Officer"}
												width={20}
												height={20}
												className="w-5 h-5 rounded-full border border-[#D7B05C] object-cover shrink-0"
											/>
										) : (
											<div className="w-5 h-5 rounded-full border border-[#D7B05C] bg-[#2D1B10] flex items-center justify-center shrink-0">
												<UserIcon size={11} className="text-[#D7B05C]" />
											</div>
										)}
										<span className="truncate max-w-[130px]">
											{item.author?.name ||
												item.author?.email.split("@")[0] ||
												"Officer"}
										</span>
									</div>
									<div className="flex items-center gap-2 text-[#D7B05C]/50 text-[10px]">
										<span>
											{new Date(item.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
										<button
											type="button"
											onClick={() => handleDelete(item.id)}
											disabled={deletingId === item.id}
											className="text-rose-400 hover:text-rose-300 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-0.5"
											title="Delete Comment"
										>
											{deletingId === item.id ? (
												<Loader2 size={11} className="animate-spin" />
											) : (
												<Trash2 size={11} />
											)}
										</button>
									</div>
								</div>
								<p className="text-[#F8EEDB]/90 text-xs font-sans leading-relaxed pl-7">
									{item.content}
								</p>
							</div>
						);
					})
				)}
			</div>

			{/* Fixed Composer Form */}
			<form
				onSubmit={handlePostComment}
				className="pt-2 border-t-2 border-[#4A2C1D] flex gap-2 flex-none"
			>
				<input
					type="text"
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder="Post a tactical update..."
					className="flex-1 px-3 py-1.5 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] shadow-inner"
				/>
				<button
					type="submit"
					disabled={isSubmitting || !newComment.trim()}
					className="px-3.5 py-1.5 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] hover:border-[#FFF5D6] transition-all rounded-xs text-xs font-sans font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-md"
				>
					{isSubmitting ? (
						<Loader2 size={13} className="animate-spin text-[#D7B05C]" />
					) : (
						<Send size={13} className="text-[#D7B05C]" />
					)}
					<span>Dispatch</span>
				</button>
			</form>
		</div>
	);
}

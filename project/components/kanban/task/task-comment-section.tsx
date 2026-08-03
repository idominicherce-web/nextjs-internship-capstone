"use client";

import {
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
}

export function TaskCommentSection({
	taskId,
	projectId,
}: TaskCommentSectionProps) {
	const [comments, setComments] = useState<TaskCommentWithAuthor[]>([]);
	const [newComment, setNewComment] = useState("");
	const [isFetching, setIsFetching] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	const fetchComments = useCallback(async () => {
		setIsFetching(true);
		const result = await getTaskComments(taskId);
		if (result.success && result.data) {
			setComments(result.data);
		}
		setIsFetching(false);
	}, [taskId]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

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

	return (
		<div className="flex flex-col h-full min-h-0 space-y-3 font-serif">
			{/* Panel Header */}
			<div className="flex items-center justify-between pb-2 border-b-2 border-[#4A2C1D] flex-none">
				<div className="flex items-center gap-2 text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
					<MessageSquare size={16} className="text-[#D7B05C]" />
					<span>Council Comments</span>
				</div>
				<span className="text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-xs bg-[#1A120C] border border-[#8F6236] text-[#D7B05C]">
					{comments.length} Dispatches
				</span>
			</div>

			{/* Discussion Feed (Only this area scrolls natively) */}
			<div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-[#8F6236]">
				{isFetching ? (
					<div className="flex items-center justify-center py-12 text-xs font-sans text-[#D7B05C]/70 gap-2">
						<Loader2 size={16} className="animate-spin text-[#D7B05C]" />
						<span>Gathering chronicle logs...</span>
					</div>
				) : comments.length === 0 ? (
					<div className="p-6 sm:p-8 border-2 border-dashed border-[#8F6236]/40 bg-[#15100C]/60 text-center rounded-xs my-auto space-y-2">
						<Castle size={28} className="mx-auto text-[#D7B05C]/40" />
						<h4 className="text-xs font-serif font-black text-[#F8EEDB]">
							No Council Dispatches Yet
						</h4>
						<p className="text-[10px] font-sans text-[#D7B05C]/60 max-w-xs mx-auto">
							Record the first tactical update or strategy note below.
						</p>
					</div>
				) : (
					comments.map((comment) => (
						<div
							key={comment.id}
							className="p-3 rounded-xs border border-[#8F6236]/60 bg-[#15100C]/80 text-xs font-sans space-y-1.5 relative group shadow-sm hover:border-[#D7B05C]/70 transition-colors"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 text-[#D7B05C] font-black text-xs">
									{comment.author?.imageUrl ? (
										<Image
											src={comment.author.imageUrl}
											alt={comment.author.name || "Officer"}
											width={22}
											height={22}
											className="w-5.5 h-5.5 rounded-full border border-[#D7B05C] object-cover shrink-0"
										/>
									) : (
										<div className="w-5.5 h-5.5 rounded-full border border-[#D7B05C] bg-[#2D1B10] flex items-center justify-center shrink-0">
											<UserIcon size={12} className="text-[#D7B05C]" />
										</div>
									)}
									<span className="truncate max-w-[130px]">
										{comment.author?.name ||
											comment.author?.email.split("@")[0] ||
											"Officer"}
									</span>
								</div>
								<div className="flex items-center gap-2 text-[#D7B05C]/50 text-[10px]">
									<span>
										{new Date(comment.createdAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
									<button
										type="button"
										onClick={() => handleDelete(comment.id)}
										disabled={deletingId === comment.id}
										className="text-rose-400 hover:text-rose-300 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-0.5"
										title="Delete Comment"
									>
										{deletingId === comment.id ? (
											<Loader2 size={12} className="animate-spin" />
										) : (
											<Trash2 size={12} />
										)}
									</button>
								</div>
							</div>
							<p className="text-[#F8EEDB]/90 text-xs font-sans leading-relaxed pl-7">
								{comment.content}
							</p>
						</div>
					))
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
					className="flex-1 px-3.5 py-2 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] shadow-inner"
				/>
				<button
					type="submit"
					disabled={isSubmitting || !newComment.trim()}
					className="px-4 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] hover:border-[#FFF5D6] transition-all rounded-xs text-xs font-sans font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-md"
				>
					{isSubmitting ? (
						<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
					) : (
						<Send size={14} className="text-[#D7B05C]" />
					)}
					<span>Dispatch</span>
				</button>
			</form>
		</div>
	);
}

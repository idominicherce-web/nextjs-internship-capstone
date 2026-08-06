"use client";

import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	Shield,
	UserPlus,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { assignUserToProject } from "@/actions/project-members";
import { getProjects } from "@/actions/projects";
import { getUsers } from "@/actions/users";

interface AssignProjectMemberModalProps {
	projectId?: string;
	isOpen: boolean;
	onClose: () => void;
}

export function AssignProjectMemberModal({
	projectId,
	isOpen,
	onClose,
}: AssignProjectMemberModalProps) {
	const [usersList, setUsersList] = useState<
		{ id: string; name: string | null; email: string }[]
	>([]);
	const [projectsList, setProjectsList] = useState<
		{ id: string; name: string }[]
	>([]);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
	const [role, setRole] = useState<"Viewer" | "Member" | "Admin">("Member");
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (projectId) {
			setSelectedProjectId(projectId);
		}
	}, [projectId]);

	useEffect(() => {
		if (!isOpen) return;

		async function loadData() {
			setIsFetching(true);
			const [usersRes, projectsData] = await Promise.all([
				getUsers(),
				getProjects(),
			]);

			if (usersRes.success && usersRes.data) {
				setUsersList(usersRes.data);
				if (usersRes.data.length > 0) {
					setSelectedUserId(usersRes.data[0].id);
				}
			}

			if (projectsData && projectsData.length > 0) {
				setProjectsList(projectsData.map((p) => ({ id: p.id, name: p.name })));
				if (!projectId) {
					setSelectedProjectId(projectsData[0].id);
				}
			}
			setIsFetching(false);
		}

		loadData();
	}, [isOpen, projectId]);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUserId || !selectedProjectId || isLoading) return;

		setIsLoading(true);
		setError(null);

		try {
			const res = await assignUserToProject(
				selectedProjectId,
				selectedUserId,
				role,
			);

			if (res.success) {
				setIsSuccess(true);
				setTimeout(() => {
					setIsSuccess(false);
					onClose();
				}, 1500);
			} else {
				setError(res.error || "Failed to assign officer to project.");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-serif">
			<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-6 shadow-2xl space-y-5">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
					<div className="flex items-center gap-2">
						<Shield className="text-[#D7B05C]" size={20} />
						<h3 className="font-serif font-black text-lg text-[#F8EEDB] uppercase tracking-wider">
							Assign Project Officer
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

				{/* Body Form */}
				{isFetching ? (
					<div className="py-8 flex items-center justify-center gap-2 text-xs font-sans text-[#D7B05C]">
						<Loader2 size={16} className="animate-spin text-[#D7B05C]" />
						<span>Gathering realm dossiers...</span>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<p className="text-xs font-serif italic text-[#D7B05C]/80">
							Deploy a sworn officer to a project campaign with designated
							permissions.
						</p>

						{/* Officer Selection */}
						<div className="space-y-1.5">
							<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
								Select Officer
							</label>
							<select
								value={selectedUserId}
								onChange={(e) => setSelectedUserId(e.target.value)}
								className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
							>
								{usersList.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name || user.email} ({user.email})
									</option>
								))}
							</select>
						</div>

						{/* Project Campaign Selection */}
						<div className="space-y-1.5">
							<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
								Project Campaign
							</label>
							<select
								value={selectedProjectId}
								onChange={(e) => setSelectedProjectId(e.target.value)}
								disabled={!!projectId}
								className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer disabled:opacity-60"
							>
								{projectsList.map((proj) => (
									<option key={proj.id} value={proj.id}>
										{proj.name}
									</option>
								))}
							</select>
						</div>

						{/* Campaign Role Selection */}
						<div className="space-y-1.5">
							<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
								Campaign Access Level
							</label>
							<select
								value={role}
								onChange={(e) =>
									setRole(e.target.value as "Viewer" | "Member" | "Admin")
								}
								className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
							>
								<option value="Viewer">Viewer (Read-only)</option>
								<option value="Member">Member (Create & Edit)</option>
								<option value="Admin">Admin (Full Control)</option>
							</select>
						</div>

						{/* Success / Error Display */}
						{isSuccess && (
							<div className="p-3 rounded-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-sans">
								<CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
								<span>Officer successfully assigned to campaign!</span>
							</div>
						)}

						{error && (
							<div className="p-3 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 font-sans">
								<AlertCircle size={16} className="text-rose-400 shrink-0" />
								<span>{error}</span>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex items-center justify-end gap-3 pt-3 border-t border-[#4A2C1D]">
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
									<UserPlus size={14} className="text-[#D7B05C]" />
								)}
								<span>{isLoading ? "Deploying..." : "Assign Officer"}</span>
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

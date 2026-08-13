"use client";

import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	Shield,
	UserPlus,
	X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { assignUserToProject } from "@/actions/project-members";
import { getProjects } from "@/actions/projects";

interface UserOption {
	id: string;
	name: string | null;
	email: string;
}

interface ProjectOption {
	id: string;
	name: string;
}

interface AssignProjectMemberModalProps {
	projectId?: string;
	initialUserId?: string;
	selectedMember?: UserOption;
	isOpen: boolean;
	onClose: () => void;
	initialProjects?: ProjectOption[];
}

export function AssignProjectMemberModal({
	projectId,
	initialUserId,
	selectedMember,
	isOpen,
	onClose,
	initialProjects = [],
}: AssignProjectMemberModalProps) {
	const [projectsList, setProjectsList] =
		useState<ProjectOption[]>(initialProjects);
	const [selectedUserId, setSelectedUserId] = useState(
		selectedMember?.id || initialUserId || "",
	);
	const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
	const [role, setRole] = useState<"Viewer" | "Member" | "Admin">("Member");
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (selectedMember?.id) {
			setSelectedUserId(selectedMember.id);
		} else if (initialUserId) {
			setSelectedUserId(initialUserId);
		}
	}, [initialUserId, selectedMember]);

	useEffect(() => {
		if (projectId) {
			setSelectedProjectId(projectId);
		}
	}, [projectId]);

	const loadData = useCallback(async () => {
		if (projectsList.length > 0) return;

		setIsFetching(true);
		try {
			const projectsData = await getProjects();

			if (projectsData && projectsData.length > 0) {
				const formattedProjects = projectsData.map((p) => ({
					id: p.id,
					name: p.name,
				}));
				setProjectsList(formattedProjects);
				if (!projectId && !selectedProjectId) {
					setSelectedProjectId(formattedProjects[0].id);
				}
			}
		} catch (err) {
			console.error("Failed to load assign modal projects:", err);
		} finally {
			setIsFetching(false);
		}
	}, [projectsList.length, selectedProjectId, projectId]);

	useEffect(() => {
		if (!isOpen) return;

		if (selectedMember?.id) {
			setSelectedUserId(selectedMember.id);
		} else if (initialUserId) {
			setSelectedUserId(initialUserId);
		}

		if (projectsList.length > 0 && !selectedProjectId && !projectId) {
			setSelectedProjectId(projectsList[0].id);
		}

		loadData();
	}, [
		isOpen,
		projectsList,
		selectedProjectId,
		projectId,
		initialUserId,
		selectedMember,
		loadData,
	]);

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
				}, 1000);
			} else {
				setError(res.error || "Failed to assign member to project.");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	const memberDisplayName =
		selectedMember?.name || selectedMember?.email || "Selected Member";

	return (
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-[100] h-screen w-screen bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 font-serif"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-6 shadow-2xl space-y-5 relative my-auto text-[#F8EEDB]">
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
					<div className="flex items-center gap-2">
						<Shield className="text-[#D7B05C]" size={20} />
						<h2 className="font-serif font-black text-lg text-[#F8EEDB] uppercase tracking-wider">
							Assign to Project
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close modal"
						className="text-[#E3C279] hover:text-[#F8EEDB] transition-colors p-1 cursor-pointer"
					>
						<X size={18} />
					</button>
				</div>

				{isFetching && projectsList.length === 0 ? (
					<div className="py-8 flex items-center justify-center gap-2 text-xs font-sans text-[#D7B05C]">
						<Loader2 size={16} className="animate-spin text-[#D7B05C]" />
						<span>Loading available projects...</span>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<p className="text-xs font-serif italic text-[#E3C279]">
							Select the project and role for{" "}
							<span className="font-bold text-[#F8EEDB] not-italic">
								{memberDisplayName}
							</span>
							.
						</p>

						{/* Member Static Info Display */}
						{selectedMember && (
							<div className="p-3 border border-[#8F6236]/60 bg-[#15100C] rounded-xs font-sans space-y-0.5">
								<span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#D7B05C]">
									Assigning Member
								</span>
								<div className="text-xs font-bold text-[#F8EEDB]">
									{selectedMember.name || selectedMember.email}
								</div>
								<div className="text-[11px] text-[#E3C279]">
									{selectedMember.email}
								</div>
							</div>
						)}

						{/* Project Selection Dropdown */}
						<div className="space-y-1.5 font-sans">
							<label
								htmlFor="select-assign-project"
								className="block text-xs font-extrabold uppercase tracking-wider text-[#D7B05C]"
							>
								Project
							</label>
							<select
								id="select-assign-project"
								value={selectedProjectId}
								onChange={(e) => setSelectedProjectId(e.target.value)}
								disabled={!!projectId}
								aria-label="Select Project"
								className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold rounded-xs focus:outline-hidden focus:border-[#D7B05C] cursor-pointer disabled:opacity-60"
							>
								{projectsList.map((proj) => (
									<option key={proj.id} value={proj.id}>
										{proj.name}
									</option>
								))}
							</select>
						</div>

						{/* Project Role Selection Dropdown */}
						<div className="space-y-1.5 font-sans">
							<label
								htmlFor="select-project-role"
								className="block text-xs font-extrabold uppercase tracking-wider text-[#D7B05C]"
							>
								Project Role
							</label>
							<select
								id="select-project-role"
								value={role}
								onChange={(e) =>
									setRole(e.target.value as "Viewer" | "Member" | "Admin")
								}
								aria-label="Project Role"
								className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold uppercase rounded-xs focus:outline-hidden focus:border-[#D7B05C] cursor-pointer"
							>
								<option value="Admin">
									Project Manager (Manages scope & tasks)
								</option>
								<option value="Member">
									Contributor (Creates & updates work)
								</option>
								<option value="Viewer">
									Viewer (Read-only project access)
								</option>
							</select>
						</div>

						{isSuccess && (
							<div className="p-3 rounded-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-sans">
								<CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
								<span>Member successfully assigned to project!</span>
							</div>
						)}

						{error && (
							<div className="p-3 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 font-sans">
								<AlertCircle size={16} className="text-rose-400 shrink-0" />
								<span>{error}</span>
							</div>
						)}

						<div className="flex items-center justify-end gap-3 pt-3 border-t border-[#4A2C1D]">
							<button
								type="button"
								onClick={onClose}
								disabled={isLoading}
								aria-label="Cancel Modal"
								className="px-4 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#E3C279] hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors disabled:opacity-50 cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isLoading || isSuccess}
								aria-label="Assign Project"
								className="px-5 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
							>
								{isLoading ? (
									<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
								) : (
									<UserPlus size={14} className="text-[#D7B05C]" />
								)}
								<span>{isLoading ? "Assigning..." : "Assign Project"}</span>
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

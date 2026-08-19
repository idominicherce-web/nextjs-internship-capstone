"use client";

import {
	AlertCircle,
	Check,
	CheckCircle2,
	Loader2,
	Search,
	Shield,
	UserPlus,
	X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
	assignUserToProject,
	getAssignableWorkspaceMembers,
} from "@/actions/project-members";
import {
	getProjects,
	getProjectsWhereUserNotMember,
	type ProjectOptionItem,
} from "@/actions/projects";

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
	const [mounted, setMounted] = useState(false);
	const [projectsList, setProjectsList] =
		useState<ProjectOption[]>(initialProjects);
	const [assignableMembers, setAssignableMembers] = useState<UserOption[]>([]);
	const [selectedUserId, setSelectedUserId] = useState(
		selectedMember?.id || initialUserId || "",
	);
	const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
	const [searchQuery, setSearchQuery] = useState("");
	const [role, setRole] = useState<"Viewer" | "Member" | "Admin">("Member");
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const targetMemberId = selectedMember?.id || initialUserId || selectedUserId;
	const activeProjectId = projectId || selectedProjectId;

	const isMemberContext = Boolean(selectedMember || initialUserId);
	const isProjectContext = Boolean(projectId);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Background scroll locking & Escape key listener
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

	// Fetch dynamic data depending on context
	useEffect(() => {
		if (!isOpen) return;

		let isMounted = true;
		setIsFetching(true);
		setError(null);

		if (isMemberContext && targetMemberId) {
			// FLOW A (Team Page): Query projects where the selected officer is NOT assigned
			getProjectsWhereUserNotMember(targetMemberId)
				.then((projectsData: ProjectOptionItem[]) => {
					if (isMounted) {
						const formatted: ProjectOption[] = projectsData.map((p) => ({
							id: p.id,
							name: p.name,
						}));
						setProjectsList(formatted);
						setSelectedProjectId(formatted[0]?.id || "");
					}
				})
				.finally(() => {
					if (isMounted) setIsFetching(false);
				});
		} else if (isProjectContext && projectId) {
			// FLOW B (Project Page): Query workspace officers NOT in this project
			getAssignableWorkspaceMembers(projectId)
				.then((res) => {
					if (isMounted && res.success && res.data) {
						setAssignableMembers(res.data);
					}
				})
				.finally(() => {
					if (isMounted) setIsFetching(false);
				});
		} else {
			// Fallback: Fetch general projects
			getProjects()
				.then((projectsData) => {
					if (isMounted && projectsData) {
						const formatted: ProjectOption[] = projectsData.map((p) => ({
							id: p.id,
							name: p.name,
						}));
						setProjectsList(formatted);
						if (formatted.length > 0 && !selectedProjectId) {
							setSelectedProjectId(formatted[0].id);
						}
					}
				})
				.finally(() => {
					if (isMounted) setIsFetching(false);
				});
		}

		return () => {
			isMounted = false;
		};
	}, [
		isOpen,
		projectId,
		targetMemberId,
		isMemberContext,
		isProjectContext,
		selectedProjectId,
	]);

	const filteredMembers = useMemo(() => {
		if (!searchQuery.trim()) return assignableMembers;
		const q = searchQuery.toLowerCase().trim();
		return assignableMembers.filter(
			(m) =>
				m.name?.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
		);
	}, [assignableMembers, searchQuery]);

	if (!isOpen || !mounted) return null;

	const memberDisplayName =
		selectedMember?.name || selectedMember?.email || "Selected Officer";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const finalUserId = targetMemberId || selectedUserId;
		const finalProjectId = activeProjectId;

		if (!finalUserId || !finalProjectId || isLoading) return;

		setIsLoading(true);
		setError(null);

		try {
			const res = await assignUserToProject(finalProjectId, finalUserId, role);

			if (res.success) {
				setIsSuccess(true);
				setTimeout(() => {
					setIsSuccess(false);
					setSearchQuery("");
					onClose();
				}, 1000);
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

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="assign-project-modal-title"
			className="fixed inset-0 z-[99999] h-screen w-screen bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-serif animate-in fade-in duration-150"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-6 shadow-2xl space-y-5 relative my-auto text-[#F8EEDB]">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
					<div className="flex items-center gap-2">
						<Shield className="text-[#D7B05C]" size={20} />
						<h2
							id="assign-project-modal-title"
							className="font-serif font-black text-lg text-[#F8EEDB] uppercase tracking-wider"
						>
							Assign Officer to Project
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

				<form onSubmit={handleSubmit} className="space-y-4">
					<p className="text-xs font-serif italic text-[#E3C279]">
						{isMemberContext
							? `Deploy ${memberDisplayName} to an unassigned project dossier.`
							: "Search and enlist an unassigned workspace officer to this quest board."}
					</p>

					{/* Fixed Member Card */}
					{selectedMember && (
						<div className="p-3 border border-[#8F6236]/60 bg-[#15100C] rounded-xs font-sans space-y-0.5">
							<span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#D7B05C]">
								Selected Officer
							</span>
							<div className="text-xs font-bold text-[#F8EEDB]">
								{selectedMember.name || selectedMember.email}
							</div>
							<div className="text-[11px] text-[#E3C279]">
								{selectedMember.email}
							</div>
						</div>
					)}

					{/* Target Project Dropdown */}
					{!isProjectContext && (
						<div className="space-y-1.5 font-sans">
							<label
								htmlFor="select-assign-project"
								className="block text-xs font-extrabold uppercase tracking-wider text-[#D7B05C]"
							>
								Target Project
							</label>
							{isFetching ? (
								<div className="p-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs flex items-center gap-2 rounded-xs">
									<Loader2 size={14} className="animate-spin" />
									<span>Filtering unassigned projects...</span>
								</div>
							) : projectsList.length === 0 ? (
								<div className="p-3 bg-[#2D1B10] border border-[#8F6236] text-xs italic text-[#E3C279] rounded-xs">
									This officer is already assigned to all available projects in
									this workspace.
								</div>
							) : (
								<select
									id="select-assign-project"
									value={selectedProjectId}
									onChange={(e) => setSelectedProjectId(e.target.value)}
									aria-label="Select Target Project"
									className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold rounded-xs focus:outline-hidden focus:border-[#D7B05C] cursor-pointer"
								>
									{projectsList.map((proj) => (
										<option key={proj.id} value={proj.id}>
											{proj.name}
										</option>
									))}
								</select>
							)}
						</div>
					)}

					{/* Searchable Officer Selector */}
					{!isMemberContext && (
						<div className="space-y-1.5 font-sans">
							<label className="block text-xs font-extrabold uppercase tracking-wider text-[#D7B05C]">
								Search Officer
							</label>

							<div className="relative">
								<Search
									size={14}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F6236]"
								/>
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search officer by name or email..."
									className="w-full pl-9 pr-3.5 py-2 bg-[#2D1B10] border border-[#8F6236] text-[#F8EEDB] placeholder-[#8F6236]/70 text-xs font-semibold rounded-xs focus:outline-hidden focus:border-[#D7B05C]"
								/>
							</div>

							<div className="max-h-36 overflow-y-auto border border-[#4A2C1D] bg-[#15100C] rounded-xs divide-y divide-[#4A2C1D]/60 mt-1">
								{isFetching ? (
									<div className="p-4 flex items-center justify-center gap-2 text-xs text-[#D7B05C]">
										<Loader2 size={14} className="animate-spin" />
										<span>Querying unassigned officers...</span>
									</div>
								) : filteredMembers.length === 0 ? (
									<div className="p-3 text-center text-xs italic text-[#E3C279]/70">
										{searchQuery.trim()
											? "No matching officers found."
											: "All workspace officers are already assigned to this project."}
									</div>
								) : (
									filteredMembers.map((member) => {
										const isSelected = selectedUserId === member.id;
										return (
											<button
												key={member.id}
												type="button"
												onClick={() => setSelectedUserId(member.id)}
												className={`w-full text-left p-2.5 flex items-center justify-between transition-colors cursor-pointer ${
													isSelected
														? "bg-[#2D1B10] border-l-2 border-[#D7B05C] text-[#FFF5D6]"
														: "hover:bg-[#1A120C] text-[#E3C279]"
												}`}
											>
												<div>
													<div className="text-xs font-bold">
														{member.name || member.email}
													</div>
													<div className="text-[10px] text-[#D7B05C]/70">
														{member.email}
													</div>
												</div>
												{isSelected && (
													<Check
														size={14}
														className="text-[#D7B05C] shrink-0"
													/>
												)}
											</button>
										);
									})
								)}
							</div>
						</div>
					)}

					{/* Project Role Selection */}
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
							<option value="Viewer">Viewer (Read-only project access)</option>
						</select>
					</div>

					{/* Feedback Alerts */}
					{isSuccess && (
						<div className="p-3 rounded-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-sans">
							<CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
							<span>Officer successfully assigned to project!</span>
						</div>
					)}

					{error && (
						<div className="p-3 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 font-sans">
							<AlertCircle size={16} className="text-rose-400 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{/* Actions Footer */}
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
							disabled={
								isLoading ||
								isSuccess ||
								(!selectedProjectId && !projectId) ||
								(!selectedUserId && !targetMemberId)
							}
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
			</div>
		</div>,
		document.body,
	);
}

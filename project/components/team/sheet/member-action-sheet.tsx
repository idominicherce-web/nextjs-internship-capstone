"use client";

import {
	AlertTriangle,
	Briefcase,
	CheckCircle2,
	ChevronLeft,
	Eye,
	Loader2,
	Shield,
	Trash2,
	UserCheck,
	UserPlus,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { assignUserToProject } from "@/actions/project-members";
import {
	getProjectsWhereUserNotMember,
	type ProjectOptionItem,
} from "@/actions/projects";
import { updateMemberRoleAction } from "@/actions/team";
import type { Member } from "@/components/team/team-directory-table";

export type MemberView = "actions" | "details" | "assign" | "role" | "remove";

interface MemberActionSheetProps {
	member: Member | null;
	isOpen: boolean;
	initialView?: MemberView;
	onClose: () => void;
	onConfirmRemove: (member: Member) => Promise<void>;
	onRoleUpdated: (userId: string, newRole: string) => void;
}

const WORKSPACE_ROLES = [
	{ title: "Workspace Owner", subtext: "Royal Sovereign · Full control" },
	{ title: "Administrator", subtext: "Chancellor · Admin access" },
	{ title: "Project Manager", subtext: "High Commander · Manages scope" },
	{ title: "Developer", subtext: "Royal Engineer · Builds objectives" },
	{ title: "Designer", subtext: "Master Artisan · Crafts UI" },
	{ title: "QA Engineer", subtext: "Royal Inquisitor · Verifies quality" },
	{ title: "Member", subtext: "Knight · Standard access" },
];

export function MemberActionSheet({
	member,
	isOpen,
	initialView = "actions",
	onClose,
	onConfirmRemove,
	onRoleUpdated,
}: MemberActionSheetProps) {
	const [view, setView] = useState<MemberView>(initialView);
	const [mounted, setMounted] = useState(false);

	// Change Role state
	const [selectedRole, setSelectedRole] = useState("");
	const [roleLoading, setRoleLoading] = useState(false);
	const [roleSuccess, setRoleSuccess] = useState(false);
	const [roleError, setRoleError] = useState<string | null>(null);

	// Remove state
	const [removeLoading, setRemoveLoading] = useState(false);

	// Assign Project state
	const [projectsList, setProjectsList] = useState<
		{ id: string; name: string }[]
	>([]);
	const [selectedProjectId, setSelectedProjectId] = useState("");
	const [projectRole, setProjectRole] = useState<"Viewer" | "Member" | "Admin">(
		"Member",
	);
	const [assignLoading, setAssignLoading] = useState(false);
	const [assignFetching, setAssignFetching] = useState(false);
	const [assignSuccess, setAssignSuccess] = useState(false);
	const [assignError, setAssignError] = useState<string | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Sync initial view and member data when opened
	useEffect(() => {
		if (isOpen) {
			setView(initialView);
			if (member) {
				setSelectedRole(member.role);
			}
		}
	}, [isOpen, initialView, member]);

	// Fetch unassigned projects when Assign view is opened
	useEffect(() => {
		if (!isOpen || view !== "assign" || !member) return;

		let isMounted = true;
		setAssignFetching(true);
		setAssignError(null);

		getProjectsWhereUserNotMember(member.id)
			.then((projectsData: ProjectOptionItem[]) => {
				if (!isMounted) return;
				const formatted = projectsData.map((p) => ({
					id: p.id,
					name: p.name,
				}));
				setProjectsList(formatted);
				setSelectedProjectId(formatted[0]?.id || "");
			})
			.catch(() => {
				if (isMounted) setAssignError("Failed to load projects.");
			})
			.finally(() => {
				if (isMounted) setAssignFetching(false);
			});

		return () => {
			isMounted = false;
		};
	}, [isOpen, view, member]);

	if (!isOpen || !member || !mounted) return null;

	const handleRoleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setRoleLoading(true);
		setRoleError(null);

		try {
			const res = await updateMemberRoleAction(member.id, selectedRole);
			if (res.success) {
				setRoleSuccess(true);
				onRoleUpdated(member.id, selectedRole);
				setTimeout(() => {
					setRoleSuccess(false);
					onClose();
				}, 800);
			} else {
				setRoleError(res.error || "Failed to update workspace role.");
			}
		} catch (err) {
			console.error(err);
			setRoleError("An unexpected error occurred.");
		} finally {
			setRoleLoading(false);
		}
	};

	const handleAssignSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedProjectId) return;

		setAssignLoading(true);
		setAssignError(null);

		try {
			const res = await assignUserToProject(
				selectedProjectId,
				member.id,
				projectRole,
			);
			if (res.success) {
				setAssignSuccess(true);
				setTimeout(() => {
					setAssignSuccess(false);
					onClose();
				}, 800);
			} else {
				setAssignError(res.error || "Failed to assign project.");
			}
		} catch (err) {
			console.error(err);
			setAssignError("An unexpected error occurred.");
		} finally {
			setAssignLoading(false);
		}
	};

	const handleRemoveSubmit = async () => {
		setRemoveLoading(true);
		try {
			await onConfirmRemove(member);
		} finally {
			setRemoveLoading(false);
		}
	};

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="sheet-title"
			className="fixed inset-0 min-h-[100dvh] w-screen z-[99999] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center sm:justify-end font-serif animate-in fade-in duration-150"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full sm:max-w-md h-full sm:h-full max-h-[100dvh] sm:max-h-screen rounded-t-lg sm:rounded-none border-t-2 sm:border-l-2 border-[#8F6236] bg-[#1A120C] p-5 shadow-2xl flex flex-col justify-between text-[#F8EEDB] relative my-0 overflow-hidden">
				{/* Sheet Navigation Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3 shrink-0">
					<div className="flex items-center gap-2">
						{view !== "actions" && (
							<button
								type="button"
								onClick={() => setView("actions")}
								className="p-1 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
								title="Back to Actions"
							>
								<ChevronLeft size={20} />
							</button>
						)}
						<Shield size={18} className="text-[#D7B05C]" />
						<h2
							id="sheet-title"
							className="font-serif font-black text-base text-[#F8EEDB] uppercase tracking-wider"
						>
							{view === "actions" && "Officer Options"}
							{view === "details" && "Officer Dossier"}
							{view === "assign" && "Deploy to Project"}
							{view === "role" && "Change Role"}
							{view === "remove" && "Discharge Officer"}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="p-1 text-[#E3C279] hover:text-white transition-colors cursor-pointer"
					>
						<X size={18} />
					</button>
				</div>

				{/* Content Views Area */}
				<div className="flex-1 overflow-y-auto py-3 space-y-4 font-sans">
					{/* Header Member Badge */}
					<div className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C] flex items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs border-2 border-[#D7B05C] bg-[#2D1B10] font-serif font-black text-xs text-[#D7B05C]">
							{member.avatar}
						</div>
						<div className="min-w-0 flex-1">
							<h3 className="font-serif font-bold text-sm text-[#F8EEDB] truncate">
								{member.name}
							</h3>
							<p className="text-[11px] text-[#E3C279] truncate">
								{member.email}
							</p>
						</div>
					</div>

					{/* VIEW 1: ACTIONS MENU */}
					{view === "actions" && (
						<div className="space-y-2">
							<button
								type="button"
								onClick={() => setView("details")}
								className="w-full p-3 rounded-xs border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-white transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left flex items-center gap-3"
							>
								<Eye size={16} />
								<div>
									<div>View Officer Dossier</div>
									<span className="text-[10px] text-[#E3C279] font-serif italic normal-case font-normal">
										Inspect activity & assignments
									</span>
								</div>
							</button>

							<button
								type="button"
								onClick={() => setView("assign")}
								className="w-full p-3 rounded-xs border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-white transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left flex items-center gap-3"
							>
								<UserPlus size={16} />
								<div>
									<div>Assign to Project</div>
									<span className="text-[10px] text-[#E3C279] font-serif italic normal-case font-normal">
										Deploy to quest board
									</span>
								</div>
							</button>

							<button
								type="button"
								onClick={() => setView("role")}
								className="w-full p-3 rounded-xs border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-white transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left flex items-center gap-3"
							>
								<UserCheck size={16} />
								<div>
									<div>Change Workspace Role</div>
									<span className="text-[10px] text-[#E3C279] font-serif italic normal-case font-normal">
										Update council access rights
									</span>
								</div>
							</button>

							<div className="pt-2 border-t border-[#4A2C1D]">
								<button
									type="button"
									onClick={() => setView("remove")}
									className="w-full p-3 rounded-xs border border-rose-900 bg-rose-950/80 text-rose-200 hover:bg-rose-900 transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left flex items-center gap-3"
								>
									<Trash2 size={16} className="text-rose-400" />
									<div>
										<div>Discharge Officer</div>
										<span className="text-[10px] text-rose-300 font-serif italic normal-case font-normal">
											Revoke workspace access
										</span>
									</div>
								</button>
							</div>
						</div>
					)}

					{/* VIEW 2: DETAILS */}
					{view === "details" && (
						<div className="space-y-3 text-xs">
							<div className="space-y-1">
								<span className="text-[10px] font-bold uppercase text-[#E3C279]">
									Council Role
								</span>
								<div className="p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] text-[#F8EEDB] font-bold">
									{member.role}
								</div>
							</div>

							<div className="space-y-1">
								<span className="text-[10px] font-bold uppercase text-[#E3C279]">
									Assigned Campaigns
								</span>
								<div className="p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] text-[#F8EEDB] flex items-center gap-2">
									<Briefcase size={14} className="text-[#D7B05C]" />
									<span>{member.projectCount} Active Projects</span>
								</div>
							</div>

							<div className="space-y-1">
								<span className="text-[10px] font-bold uppercase text-[#E3C279]">
									Last Active
								</span>
								<div className="p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] text-[#F8EEDB]">
									<span>{member.lastActive}</span>
								</div>
							</div>
						</div>
					)}

					{/* VIEW 3: ASSIGN PROJECT */}
					{view === "assign" && (
						<form onSubmit={handleAssignSubmit} className="space-y-3">
							<div className="space-y-1.5">
								<label className="block text-xs font-extrabold uppercase text-[#D7B05C]">
									Target Project
								</label>
								{assignFetching ? (
									<div className="p-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs flex items-center gap-2 rounded-xs">
										<Loader2 size={14} className="animate-spin" />
										<span>Filtering projects...</span>
									</div>
								) : projectsList.length === 0 ? (
									<div className="p-3 bg-[#2D1B10] border border-[#8F6236] text-xs italic text-[#E3C279] rounded-xs">
										Officer is already assigned to all projects.
									</div>
								) : (
									<select
										value={selectedProjectId}
										onChange={(e) => setSelectedProjectId(e.target.value)}
										className="w-full px-3 py-2 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold rounded-xs cursor-pointer"
									>
										{projectsList.map((p) => (
											<option key={p.id} value={p.id}>
												{p.name}
											</option>
										))}
									</select>
								)}
							</div>

							<div className="space-y-1.5">
								<label className="block text-xs font-extrabold uppercase text-[#D7B05C]">
									Project Role
								</label>
								<select
									value={projectRole}
									onChange={(e) =>
										setProjectRole(
											e.target.value as "Viewer" | "Member" | "Admin",
										)
									}
									className="w-full px-3 py-2 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold uppercase rounded-xs cursor-pointer"
								>
									<option value="Admin">Project Manager (Admin)</option>
									<option value="Member">Contributor (Member)</option>
									<option value="Viewer">Viewer (Read-only)</option>
								</select>
							</div>

							{assignSuccess && (
								<div className="p-2.5 rounded-xs bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
									<CheckCircle2 size={14} />
									<span>Assigned successfully!</span>
								</div>
							)}

							{assignError && (
								<div className="p-2.5 rounded-xs bg-rose-950 border border-rose-800 text-rose-200 text-xs font-sans">
									<span>{assignError}</span>
								</div>
							)}

							<button
								type="submit"
								disabled={assignLoading || projectsList.length === 0}
								className="w-full py-2.5 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] text-xs font-black uppercase rounded-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
							>
								{assignLoading ? (
									<Loader2 size={14} className="animate-spin" />
								) : (
									<UserPlus size={14} />
								)}
								<span>{assignLoading ? "Deploying..." : "Deploy"}</span>
							</button>
						</form>
					)}

					{/* VIEW 4: CHANGE ROLE */}
					{view === "role" && (
						<form onSubmit={handleRoleSubmit} className="space-y-3">
							<div className="space-y-1.5">
								<label className="block text-xs font-extrabold uppercase text-[#D7B05C]">
									New Workspace Role
								</label>
								<select
									value={selectedRole}
									onChange={(e) => setSelectedRole(e.target.value)}
									className="w-full px-3 py-2 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold rounded-xs cursor-pointer"
								>
									{WORKSPACE_ROLES.map((r) => (
										<option key={r.title} value={r.title}>
											{r.title} ({r.subtext})
										</option>
									))}
								</select>
							</div>

							{roleSuccess && (
								<div className="p-2.5 rounded-xs bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
									<CheckCircle2 size={14} />
									<span>Role updated successfully!</span>
								</div>
							)}

							{roleError && (
								<div className="p-2.5 rounded-xs bg-rose-950 border border-rose-800 text-rose-200 text-xs font-sans">
									<span>{roleError}</span>
								</div>
							)}

							<button
								type="submit"
								disabled={roleLoading}
								className="w-full py-2.5 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] text-xs font-black uppercase rounded-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
							>
								{roleLoading && <Loader2 size={14} className="animate-spin" />}
								<span>{roleLoading ? "Saving..." : "Save Role"}</span>
							</button>
						</form>
					)}

					{/* VIEW 5: REMOVE CONFIRMATION */}
					{view === "remove" && (
						<div className="space-y-3 text-xs">
							<div className="p-3 rounded-xs border border-rose-900 bg-rose-950/40 text-rose-200 space-y-1.5">
								<div className="flex items-center gap-2 font-bold text-rose-300 uppercase">
									<AlertTriangle size={16} />
									<span>Confirm Discharge</span>
								</div>
								<p>
									Revoke workspace access for{" "}
									<strong className="text-white">{member.name}</strong>?
								</p>
								<ul className="list-disc list-inside text-[11px] text-rose-200/80 space-y-0.5">
									<li>Workspace access revoked immediately</li>
									<li>Project memberships removed</li>
								</ul>
							</div>

							<button
								type="button"
								onClick={handleRemoveSubmit}
								disabled={removeLoading}
								className="w-full py-2.5 border border-rose-700 bg-rose-950 text-rose-200 hover:bg-rose-900 text-xs font-black uppercase rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
							>
								{removeLoading ? (
									<Loader2 size={14} className="animate-spin" />
								) : (
									<Trash2 size={14} />
								)}
								<span>
									{removeLoading ? "Discharging..." : "Confirm Discharge"}
								</span>
							</button>
						</div>
					)}
				</div>

				{/* Sheet Footer */}
				<div className="pt-3 border-t border-[#4A2C1D] flex justify-end shrink-0">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-1.5 border border-[#8F6236]/60 bg-[#15100C] text-[#E3C279] hover:text-white text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer"
					>
						Close
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}

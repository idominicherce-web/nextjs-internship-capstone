"use client";

import { MoreHorizontal, Scroll, Users } from "lucide-react";
import { getDisciplineTheme } from "@/lib/roles";

export interface Member {
	id: string;
	name: string;
	role: string;
	email: string;
	avatar: string;
	projectCount: number;
	status: "Online" | "Away" | "Offline";
	lastActive: string;
}

interface TeamDirectoryTableProps {
	members: Member[];
	onSelectMember: (member: Member) => void;
}

export function TeamDirectoryTable({
	members,
	onSelectMember,
}: TeamDirectoryTableProps) {
	if (members.length === 0) {
		return (
			<div className="p-8 rounded-xs border-2 border-dashed border-[#8F6236]/50 bg-[#15100C] text-center space-y-3">
				<Users className="mx-auto h-10 w-10 text-[#D7B05C]/50" />
				<h3 className="font-serif font-black text-lg text-[#F8EEDB]">
					No Team Members Found
				</h3>
				<p className="text-xs font-sans text-[#D7B05C]/70 max-w-md mx-auto">
					No team members have joined this workspace. Invite collaborators to
					begin managing projects together.
				</p>
				<p className="text-[11px] font-serif italic text-[#D7B05C]/50">
					The Roundtable awaits its first officers.
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b-2 border-[#4A2C1D] bg-[#15100C] text-[10px] font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							<th className="p-3.5 pl-5">Member</th>
							<th className="p-3.5">Role</th>
							<th className="p-3.5">Projects</th>
							<th className="p-3.5">Status</th>
							<th className="p-3.5">Last Active</th>
							<th className="p-3.5 pr-5 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#4A2C1D]/60 text-xs font-sans">
						{members.map((member) => {
							const theme = getDisciplineTheme(member.role);

							const statusBadge =
								member.status === "Online"
									? "bg-emerald-950 text-emerald-300 border-emerald-700"
									: member.status === "Away"
										? "bg-amber-950 text-amber-300 border-amber-700"
										: "bg-[#2D1B10] text-[#D7B05C]/60 border-[#8F6236]";

							return (
								<tr
									key={member.id}
									onClick={() => onSelectMember(member)}
									className="hover:bg-[#2D1B10]/60 transition-colors cursor-pointer group"
								>
									{/* Name & Avatar */}
									<td className="p-3.5 pl-5">
										<div className="flex items-center gap-3">
											<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs border border-[#D7B05C]/50 bg-[#15100C] text-[#D7B05C] font-black text-xs shadow-md">
												{member.avatar}
											</div>
											<div>
												<span className="block font-serif font-black text-[#F8EEDB] group-hover:text-[#D7B05C] transition-colors text-sm">
													{member.name}
												</span>
												<span className="block text-[10px] text-[#D7B05C]/70 italic">
													{member.email}
												</span>
											</div>
										</div>
									</td>

									{/* Role & Royal Title */}
									<td className="p-3.5">
										<div>
											<span
												className={`inline-block font-sans text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
											>
												{member.role}
											</span>
											<span className="block text-[9.5px] font-serif italic text-[#D7B05C]/60 mt-0.5">
												{theme.royalTitle}
											</span>
										</div>
									</td>

									{/* Projects */}
									<td className="p-3.5 font-bold text-[#F8EEDB]">
										<span className="inline-flex items-center gap-1 text-[#D7B05C]">
											<Scroll size={13} /> {member.projectCount} Projects
										</span>
									</td>

									{/* Status */}
									<td className="p-3.5">
										<span
											className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-xs border ${statusBadge}`}
										>
											{member.status}
										</span>
									</td>

									{/* Last Active */}
									<td className="p-3.5 text-[#D7B05C]/70 text-[11px] font-serif italic">
										{member.lastActive}
									</td>

									{/* Actions */}
									<td className="p-3.5 pr-5 text-right">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												onSelectMember(member);
											}}
											className="p-1.5 text-[#D7B05C]/60 hover:text-[#D7B05C] hover:bg-[#15100C] rounded-xs transition-colors"
										>
											<MoreHorizontal size={16} />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

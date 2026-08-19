"use client";

import { MoreHorizontal } from "lucide-react";

export interface Member {
	id: string;
	name: string;
	role: string;
	email: string;
	avatar: string;
	projectCount: number;
	status: "Online" | "Offline" | "Away";
	lastActive: string;
}

interface TeamDirectoryTableProps {
	members: Member[];
	onOpenActions?: (member: Member) => void;
}

const ROLE_FLAVOR_MAP: Record<string, string> = {
	"Workspace Owner": "Royal Sovereign",
	Administrator: "Chancellor",
	"Project Manager": "High Commander",
	Developer: "Royal Engineer",
	Designer: "Master Artisan",
	"QA Engineer": "Royal Inquisitor",
	Member: "Knight",
};

export function TeamDirectoryTable({
	members,
	onOpenActions,
}: TeamDirectoryTableProps) {
	return (
		<div className="relative w-full min-w-0">
			{/* DESKTOP TABLE */}
			<div className="hidden md:block w-full min-w-0 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl overflow-x-auto">
				<table className="w-full text-left font-serif border-collapse">
					<thead>
						<tr className="border-b-2 border-[#4A2C1D] bg-[#2D1B10]/80 text-[10px] font-sans font-black uppercase tracking-[0.18em] text-[#E3C279] whitespace-nowrap">
							<th className="px-4 py-3.5">Member</th>
							<th className="px-4 py-3.5">Role</th>
							<th className="px-4 py-3.5 text-center">Projects</th>
							<th className="px-4 py-3.5 text-center">Status</th>
							<th className="hidden lg:table-cell px-4 py-3.5 text-right">
								Last Active
							</th>
							<th className="px-4 py-3.5 text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#4A2C1D]/60 text-xs font-sans">
						{members.map((m) => {
							const flavorText = ROLE_FLAVOR_MAP[m.role] || "Council Member";
							return (
								<tr
									key={m.id}
									className="hover:bg-[#2D1B10]/50 transition-colors"
								>
									{/* Member Info */}
									<td className="px-4 py-3.5 whitespace-nowrap">
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xs border border-[#D7B05C] bg-[#15100C] font-serif font-black text-xs text-[#D7B05C] shadow-sm">
												{m.avatar}
											</div>
											<div className="min-w-0">
												<span className="block font-serif font-bold text-[#F8EEDB] whitespace-nowrap">
													{m.name}
												</span>
												<span className="block text-[10px] text-[#E3C279] truncate">
													{m.email}
												</span>
											</div>
										</div>
									</td>

									{/* Role Column */}
									<td className="px-4 py-3.5 whitespace-nowrap">
										<div>
											<span className="block font-sans text-xs font-black uppercase tracking-wider text-[#D7B05C] whitespace-nowrap">
												{m.role}
											</span>
											<span className="block font-serif italic text-[10px] text-[#E3C279] whitespace-nowrap">
												{flavorText}
											</span>
										</div>
									</td>

									{/* Projects */}
									<td className="px-4 py-3.5 text-center whitespace-nowrap">
										<span className="font-mono text-xs font-extrabold text-[#F8EEDB]">
											{m.projectCount} Active
										</span>
									</td>

									{/* Status Badge */}
									<td className="px-4 py-3.5 text-center whitespace-nowrap">
										<span
											className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-xs text-[9px] font-sans font-bold uppercase border whitespace-nowrap leading-none ${
												m.status === "Online"
													? "border-emerald-800 bg-emerald-950 text-emerald-300"
													: m.status === "Away"
														? "border-amber-800 bg-amber-950 text-amber-300"
														: "border-[#8F6236]/40 bg-[#15100C] text-[#E3C279]"
											}`}
										>
											<span
												className={`h-1.5 w-1.5 rounded-full shrink-0 ${
													m.status === "Online"
														? "bg-emerald-400"
														: m.status === "Away"
															? "bg-amber-400"
															: "bg-[#E3C279]"
												}`}
											/>
											<span>{m.status}</span>
										</span>
									</td>

									{/* Last Active */}
									<td className="hidden lg:table-cell px-4 py-3.5 text-right font-serif italic text-[#E3C279] whitespace-nowrap">
										{m.lastActive}
									</td>

									{/* Actions Trigger */}
									<td className="px-4 py-3.5 text-center whitespace-nowrap">
										<button
											type="button"
											onClick={() => onOpenActions?.(m)}
											aria-label={`Open actions for ${m.name}`}
											className="p-1.5 rounded-xs border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors cursor-pointer inline-flex items-center justify-center"
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

			{/* MOBILE CARDS (Visible only below md breakpoint) */}
			<div className="block md:hidden space-y-3">
				{members.map((m) => {
					const flavorText = ROLE_FLAVOR_MAP[m.role] || "Council Member";
					return (
						<div
							key={m.id}
							className="p-3.5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-lg space-y-3 font-serif"
						>
							<div className="flex items-start justify-between gap-2">
								<div className="flex items-center gap-2.5 min-w-0">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs border border-[#D7B05C] bg-[#15100C] font-black text-xs text-[#D7B05C]">
										{m.avatar}
									</div>
									<div className="min-w-0">
										<h3 className="font-bold text-sm text-[#F8EEDB] truncate">
											{m.name}
										</h3>
										<span className="block text-[10px] text-[#E3C279] truncate">
											{m.email}
										</span>
									</div>
								</div>

								<span
									className={`inline-flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-xs text-[9px] font-sans font-bold uppercase border shrink-0 whitespace-nowrap leading-none ${
										m.status === "Online"
											? "border-emerald-800 bg-emerald-950 text-emerald-300"
											: m.status === "Away"
												? "border-amber-800 bg-amber-950 text-amber-300"
												: "border-[#8F6236]/40 bg-[#15100C] text-[#E3C279]"
									}`}
								>
									<span
										className={`h-1.5 w-1.5 rounded-full shrink-0 ${
											m.status === "Online"
												? "bg-emerald-400"
												: m.status === "Away"
													? "bg-amber-400"
													: "bg-[#E3C279]"
										}`}
									/>
									<span>{m.status}</span>
								</span>
							</div>

							<div className="flex items-center justify-between pt-2 border-t border-[#4A2C1D]/60 text-xs font-sans">
								<div className="min-w-0">
									<span className="block text-[10px] font-bold uppercase text-[#D7B05C] truncate">
										{m.role}
									</span>
									<span className="block text-[9px] font-serif italic text-[#E3C279] truncate">
										{flavorText}
									</span>
								</div>
								<span className="text-[11px] font-bold text-[#F8EEDB] shrink-0">
									{m.projectCount} Projects
								</span>
							</div>

							<div className="flex items-center justify-between gap-2 pt-1">
								<button
									type="button"
									onClick={() => onOpenActions?.(m)}
									aria-label={`Open actions for ${m.name}`}
									className="flex-1 py-2 border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-white font-sans text-xs font-extrabold uppercase rounded-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
								>
									<span>Member Actions</span>
									<MoreHorizontal size={14} />
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

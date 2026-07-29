"use client";

import { Activity, AlertCircle, Shield, TrendingUp, Users } from "lucide-react";
import { DashboardSection } from "@/components/layout/dashboard-section";

interface KingdomHealthWidgetProps {
	completionRate: number;
	overdueRate: number;
	overdueTasksCount: number;
}

export function KingdomHealthWidget({
	completionRate,
	overdueRate,
	overdueTasksCount,
}: KingdomHealthWidgetProps) {
	return (
		<DashboardSection>
			<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2 mb-3">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<Shield size={18} />
					<h3 className="font-serif font-black uppercase text-xs tracking-widest text-[#F8EEDB]">
						Kingdom Operations Health
					</h3>
				</div>
				<span className="text-[10px] font-sans font-bold text-emerald-400 uppercase">
					Status: Operational
				</span>
			</div>

			<div className="space-y-3.5">
				<div>
					<div className="flex justify-between text-[10px] font-sans font-bold text-[#D7B05C] mb-1">
						<span className="flex items-center gap-1">
							<TrendingUp size={12} /> Overall Completion
						</span>
						<span>{completionRate}%</span>
					</div>
					<div className="h-2.5 w-full bg-[#100A07] rounded-xs border border-[#8F6236] overflow-hidden p-0.5">
						<div
							className="h-full bg-gradient-to-r from-[#8F6236] to-[#D7B05C]"
							style={{ width: `${completionRate}%` }}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#4A2C1D]/60 text-xs font-sans">
					<div className="p-2 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
						<span className="flex items-center gap-1 text-[9px] font-bold text-[#D7B05C]/70 uppercase">
							<AlertCircle size={10} className="text-rose-400" /> Overdue
							Objectives
						</span>
						<p className="text-sm font-serif font-black text-rose-400 mt-0.5">
							{overdueTasksCount}
						</p>
					</div>

					<div className="p-2 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
						<span className="flex items-center gap-1 text-[9px] font-bold text-[#D7B05C]/70 uppercase">
							<Users size={10} className="text-sky-300" /> Officer Capacity
						</span>
						<p className="text-sm font-serif font-black text-sky-300 mt-0.5">
							Balanced
						</p>
					</div>

					<div className="p-2 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
						<span className="flex items-center gap-1 text-[9px] font-bold text-[#D7B05C]/70 uppercase">
							<Activity size={10} className="text-emerald-400" /> Weekly
							Velocity
						</span>
						<p className="text-sm font-serif font-black text-emerald-400 mt-0.5">
							▲ +12%
						</p>
					</div>

					<div className="p-2 bg-[#15100C] border border-[#4A2C1D] rounded-xs">
						<span className="flex items-center gap-1 text-[9px] font-bold text-[#D7B05C]/70 uppercase">
							Overdue Rate
						</span>
						<p className="text-sm font-serif font-black text-[#F8EEDB] mt-0.5">
							{overdueRate}%
						</p>
					</div>
				</div>
			</div>
		</DashboardSection>
	);
}

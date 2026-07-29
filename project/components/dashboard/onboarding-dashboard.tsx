"use client";

import { BarChart3, Calendar, Plus, Scroll, Users } from "lucide-react";
import Link from "next/link";

export function OnboardingDashboard() {
	const steps = [
		{ label: "Create Your First quest", href: "/projects", icon: Plus },
		{ label: "Assemble Officers to Team", href: "/team", icon: Users },
		{ label: "Schedule quest Deadlines", href: "/calendar", icon: Calendar },
		{
			label: "Inspect Intelligence Reports",
			href: "/analytics",
			icon: BarChart3,
		},
	];

	return (
		<div className="p-8 border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] rounded-xs shadow-2xl text-center space-y-6">
			<Scroll className="mx-auto h-16 w-16 text-[#D7B05C]" />
			<div className="space-y-2">
				<h2 className="text-2xl font-serif font-black text-[#F8EEDB] uppercase tracking-wider">
					Welcome to Your Royal Command Center
				</h2>
				<p className="text-xs font-sans text-[#D7B05C]/80 max-w-md mx-auto italic">
					Your kingdom awaits operational command. Follow the royal decrees
					below to initialize your workspace.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
				{steps.map((step, i) => (
					<Link
						key={i}
						href={step.href}
						className="p-4 border-2 border-[#8F6236] bg-[#15100C] hover:border-[#D7B05C] rounded-xs text-left transition-all hover:-translate-y-1 group"
					>
						<step.icon
							size={20}
							className="text-[#D7B05C] mb-2 group-hover:scale-110 transition-transform"
						/>
						<p className="text-xs font-sans font-black text-[#F8EEDB] uppercase">
							{step.label}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}

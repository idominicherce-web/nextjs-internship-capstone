import { BarChart3, Calendar, Kanban, Shield, Users, Zap } from "lucide-react";

const features = [
	{
		icon: Kanban,
		title: "War Table Kanban Boards",
		description:
			"Visualize quest workflows on handcrafted strategy boards with interactive drag-and-drop orders.",
	},
	{
		icon: Users,
		title: "Roundtable Council",
		description:
			"Assemble officers, delegate permissions, and maintain workspace harmony across all realms.",
	},
	{
		icon: Calendar,
		title: "Quest Ledger",
		description:
			"Track critical deadlines, upcoming operations, and strategic milestones on parchment calendars.",
	},
	{
		icon: BarChart3,
		title: "Intelligence Chamber",
		description:
			"Monitor quest efficiency, overdue objectives, and team productivity with war room analytics.",
	},
	{
		icon: Shield,
		title: "Guild Security",
		description:
			"Enterprise-grade Clerk authentication and PostgreSQL encryption safeguard your kingdom records.",
	},
	{
		icon: Zap,
		title: "Instant Dispatches",
		description:
			"Optimized server actions deliver real-time database updates across your entire workspace.",
	},
];

export function Features() {
	return (
		<section
			id="features"
			className="py-20 px-4 sm:px-6 lg:px-8 bg-[#100A07] text-[#F8EEDB] font-serif relative"
		>
			<div className="max-w-7xl mx-auto space-y-12">
				{/* Section Header */}
				<div className="text-center space-y-3">
					<div className="flex items-center justify-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em]">
						<span>⚔</span> Guild Capabilities <span>⚔</span>
					</div>
					<h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wider">
						Everything Required For Victory
					</h2>
					<p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 max-w-2xl mx-auto italic">
						Powerful medieval operations tools designed to keep projects
						organized and teams aligned.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={index}
								className="group relative p-6 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:border-[#D7B05C] hover:shadow-[0_10px_25px_rgba(215,176,92,0.25)] flex flex-col justify-between overflow-hidden"
							>
								{/* Forged Brass Corners */}
								<div className="absolute left-1 top-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
								<div className="absolute right-1 top-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
								<div className="absolute bottom-1 left-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
								<div className="absolute bottom-1 right-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />

								<div className="space-y-3 relative z-10">
									<div className="w-12 h-12 rounded-full border border-[#D7B05C]/60 bg-[#15100C] flex items-center justify-center text-[#D7B05C] group-hover:scale-110 transition-transform shadow-md">
										<Icon size={22} />
									</div>
									<h3 className="text-lg font-serif font-black text-[#F8EEDB] group-hover:text-[#D7B05C] transition-colors">
										{feature.title}
									</h3>
									<p className="text-xs font-sans text-[#D7B05C]/80 leading-relaxed italic">
										{feature.description}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

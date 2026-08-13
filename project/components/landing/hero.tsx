import { ArrowRight, CheckCircle, Flame, Shield, Users } from "lucide-react";
import Link from "next/link";

export function Hero() {
	return (
		<section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#15100C] text-[#F8EEDB] font-serif overflow-hidden border-b-2 border-[#4A2C1D]">
			{/* Torch Light Radial Glow */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(215,176,92,0.18),transparent_65%)] mix-blend-screen" />
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.92)_100%)] mix-blend-multiply" />

			<div className="container mx-auto text-center relative z-10">
				<div className="max-w-4xl mx-auto space-y-6">
					{/* Eyebrow Crest */}
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xs border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] text-xs font-sans font-black uppercase tracking-[0.25em] shadow-md">
						<Shield size={14} className="text-[#D7B05C]" />
						<span>✦ High Command Platform ✦</span>
					</div>

					{/* Main Title */}
					<h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-tight">
						Command Your Workspace <br />
						<span className="italic font-serif text-[#F8EEDB]">
							With Sovereign Precision
						</span>
					</h1>

					{/* Subtitle */}
					<p className="text-sm sm:text-lg font-sans text-[#D7B05C]/80 max-w-2xl mx-auto italic leading-relaxed">
						Organize quests, delegate strategic objectives, and unite your
						council using a handcrafted medieval operations board.
					</p>

					{/* Call to Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
						<Link
							href="/dashboard"
							className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.2em] rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.85)] hover:border-[#FFF5D6] hover:shadow-[0_0_30px_rgba(215,176,92,0.5)] transition-all cursor-pointer"
						>
							<span>Enter Command Chamber</span>
							<ArrowRight className="ml-2 text-[#D7B05C]" size={18} />
						</Link>

						<a
							href="#features"
							className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#8F6236] bg-[#15100C] text-[#D7B05C] font-sans text-xs font-black uppercase tracking-[0.2em] rounded-xs hover:border-[#D7B05C] hover:text-white transition-all cursor-pointer"
						>
							Explore Guild Features
						</a>
					</div>

					{/* Feature Badges */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-[#4A2C1D]/60 text-xs font-sans font-bold text-[#D7B05C]">
						<div className="flex items-center justify-center space-x-2 bg-[#2D1B10]/40 p-3 rounded-xs border border-[#4A2C1D]">
							<CheckCircle className="text-emerald-400 shrink-0" size={18} />
							<span>Real-Time Database Sync</span>
						</div>
						<div className="flex items-center justify-center space-x-2 bg-[#2D1B10]/40 p-3 rounded-xs border border-[#4A2C1D]">
							<Users className="text-sky-300 shrink-0" size={18} />
							<span>Roundtable Council Roles</span>
						</div>
						<div className="flex items-center justify-center space-x-2 bg-[#2D1B10]/40 p-3 rounded-xs border border-[#4A2C1D]">
							<Flame className="text-amber-400 shrink-0" size={18} />
							<span>Tactical Strategy Boards</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

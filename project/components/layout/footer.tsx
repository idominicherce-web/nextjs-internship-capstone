import { Github, Shield } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t border-[#4A2C1D] bg-[#100A07] text-[#F8EEDB] font-serif py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#D7B05C]/70">
				{/* Brand */}
				<div className="flex items-center gap-2">
					<div className="rounded-xs border border-[#D7B05C] bg-[#15100C] p-1 text-[#D7B05C]">
						<Shield size={14} />
					</div>
					<span className="font-black uppercase tracking-widest text-[#FFF5D6]">
						Roundtable
					</span>
					<span>• © 2026 All rights reserved</span>
				</div>

				{/* Author / GitHub */}
				<div className="flex items-center gap-1.5 hover:text-[#FFF5D6] transition-colors">
					<Github size={14} />
					<span>Crafted by Dominic Herce</span>
				</div>
			</div>
		</footer>
	);
}

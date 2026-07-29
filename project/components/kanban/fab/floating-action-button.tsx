"use client";

import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
	onClick: () => void;
	label?: string;
	sublabel?: string;
}

export function FloatingActionButton({
	onClick,
	label = "NEW TASK",
	sublabel = "Decree Objective",
}: FloatingActionButtonProps) {
	return (
		<>
			{/* Mobile-Only Circular FAB (<640px) */}
			<button
				type="button"
				onClick={onClick}
				className="sm:hidden fixed bottom-6 right-4 z-40 flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] shadow-[0_10px_25px_rgba(0,0,0,0.9)] active:scale-95 transition-all cursor-pointer"
				title={label}
			>
				<Plus size={24} className="text-[#D7B05C]" />
			</button>

			{/* Desktop Rectangular Button (≥640px) matching image_7df1de.png */}
			<button
				type="button"
				onClick={onClick}
				className="hidden sm:inline-flex items-center gap-3 px-5 py-2.5 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] rounded-xs shadow-lg hover:border-[#FFF5D6] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
			>
				<Plus size={20} className="text-[#D7B05C] shrink-0" />
				<div className="text-left leading-tight">
					<span className="block font-sans font-black text-xs uppercase tracking-widest text-[#FFF5D6]">
						{label}
					</span>
					<span className="block font-serif italic text-[10px] text-[#D7B05C]">
						{sublabel}
					</span>
				</div>
			</button>
		</>
	);
}

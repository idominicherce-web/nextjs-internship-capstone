"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateProjectModal } from "@/components/modals/create-project-modal";

export function CreateProjectButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="group relative inline-flex items-center px-6 py-3 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.85)] transition-all duration-200 hover:text-white hover:border-[#FFF5D6] hover:shadow-[0_0_30px_rgba(215,176,92,0.5)] active:translate-y-0.5 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
			>
				<Plus
					size={18}
					className="mr-2.5 text-[#D7B05C] group-hover:scale-110 transition-transform shrink-0"
				/>
				<div className="text-left">
					<span className="block font-sans text-xs font-black uppercase tracking-[0.15em] leading-tight">
						New Project
					</span>
					<span className="block font-serif text-[9px] italic text-[#D7B05C]/80">
						Open New Quest
					</span>
				</div>
			</button>

			<CreateProjectModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
}

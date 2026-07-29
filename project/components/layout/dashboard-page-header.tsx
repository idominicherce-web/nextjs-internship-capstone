import type React from "react";

interface DashboardPageHeaderProps {
	badge?: string;
	title: string;
	description?: string;
	children?: React.ReactNode;
}

export function DashboardPageHeader({
	badge,
	title,
	description,
	children,
}: DashboardPageHeaderProps) {
	return (
		<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#4A2C1D] pb-6 font-serif text-[#F8EEDB]">
			<div>
				{badge && (
					<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
						<span>⚔</span>
						<span>{badge}</span>
						<span>⚔</span>
					</div>
				)}
				<h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
					{title}
				</h1>
				{description && (
					<p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-1.5 italic max-w-xl">
						{description}
					</p>
				)}
			</div>

			{children && <div className="shrink-0">{children}</div>}
		</div>
	);
}

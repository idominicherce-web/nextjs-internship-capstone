"use client";

import type React from "react";

interface DashboardCardProps {
	children: React.ReactNode;
	className?: string;
}

export function DashboardCard({
	children,
	className = "",
}: DashboardCardProps) {
	return (
		<div
			className={`relative p-4 border-2 border-[#8F6236]/70 rounded-xs bg-[#FAF0D7] text-[#1A120C] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D7B05C] hover:shadow-[0_8px_20px_rgba(215,176,92,0.25)] overflow-hidden ${className}`}
			style={{
				backgroundImage: `
          repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.025),
            rgba(0,0,0,0.025) 1px,
            transparent 1px,
            transparent 8px
          )
        `,
			}}
		>
			{/* Weathered Parchment Vignette */}
			<div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_15px_rgba(59,36,21,0.2)] mix-blend-multiply z-0" />
			<div className="relative z-10">{children}</div>
		</div>
	);
}

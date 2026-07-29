"use client";

import type React from "react";

interface DashboardLayoutContainerProps {
	children: React.ReactNode;
}

export function DashboardLayoutContainer({
	children,
}: DashboardLayoutContainerProps) {
	return (
		<div className="min-h-full bg-[#15100C] text-[#F8EEDB] font-serif relative select-none antialiased">
			{/* Torch Light Radial Glow */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_12%,rgba(215,176,92,0.15),transparent_65%)] mix-blend-screen" />

			{/* Stone Castle Wall Vignette */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.92)_100%)] mix-blend-multiply" />

			{/* Floating Dust Particles Texture Overlay */}
			<div
				className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay"
				style={{
					backgroundImage: `radial-gradient(#D7B05C 0.75px, transparent 0.75px)`,
					backgroundSize: "24px 24px",
				}}
			/>

			<div className="relative z-10">
				<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
					{children}
				</main>
			</div>
		</div>
	);
}

// components/RoundtableWrapper.tsx
"use client";

import type React from "react";

export default function RoundtableWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const embers = Array.from({ length: 35 }).map((_, i) => ({
		id: i,
		left: `${((i * 7) % 92) + 4}%`,
		bottom: `${(i * 5) % 40}px`,
		size: i % 3 === 0 ? "w-1.5 h-1.5" : "w-1 h-1",
		blur: i % 2 === 0 ? "blur-[0.5px]" : "blur-[1px]",
		delay: `${(i * 0.3).toFixed(1)}s`,
		duration: `${(i % 4) + 8}s`,
		color:
			i % 3 === 0
				? "bg-amber-400"
				: i % 2 === 0
					? "bg-orange-400"
					: "bg-red-400",
	}));

	return (
		<div className="relative min-h-dvh overflow-x-hidden bg-[#1a120d] font-serif text-zinc-100 selection:bg-amber-300 selection:text-amber-950 group/roundtable">
			{/* Vignette Overlay */}
			<div className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.45)_100%)] mix-blend-multiply" />

			{/* Grid Pattern */}
			<div
				className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(#3a2418_1.5px,transparent_1.5px),linear-gradient(90deg,#3a2418_1.5px,transparent_1.5px)] bg-size-[140px_90px] opacity-20"
				style={{
					maskImage:
						"radial-gradient(circle at 50% 30%, #000 30%, transparent 85%)",
					WebkitMaskImage:
						"radial-gradient(circle at 50% 30%, #000 30%, transparent 85%)",
				}}
			/>

			{/* Timber Ceiling Beams */}
			<div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-10 border-b-4 border-[#3a2418] bg-linear-to-b from-[#2a1b13] to-[#1a120d] shadow-xl opacity-95">
				<div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-900/40" />
				<div className="absolute left-1/4 top-0 h-10 w-16 border-r border-amber-900/20 bg-[#211610]" />
				<div className="absolute right-1/4 top-0 h-10 w-16 border-l border-amber-900/20 bg-[#211610]" />
			</div>

			{/* Side Stone Pillars */}
			<div className="pointer-events-none absolute inset-y-0 left-0 z-30 hidden w-4 border-r border-[#3a2418]/40 bg-linear-to-r from-[#1a120d] to-[#2a1b13] opacity-90 shadow-xl lg:block" />
			<div className="pointer-events-none absolute inset-y-0 right-0 z-30 hidden w-4 border-l border-[#3a2418]/40 bg-linear-to-l from-[#1a120d] to-[#2a1b13] opacity-90 shadow-xl lg:block" />

			{/* Floating Lanterns */}
			<div className="absolute left-[6%] top-10 z-20 hidden h-32 w-px bg-zinc-700/40 xl:block">
				<div className="absolute -bottom-2 -left-1.5 h-4 w-3 animate-[pulse_2.5s_infinite] rounded-xs border border-amber-900 bg-amber-700" />
				<div className="pointer-events-none absolute -bottom-16 -left-32 h-64 w-64 animate-[pulse_4s_infinite_ease-in-out] bg-radial from-amber-500/15 via-orange-600/5 to-transparent blur-2xl" />
			</div>

			<div className="absolute right-[6%] top-10 z-20 hidden h-40 w-px bg-zinc-700/40 xl:block">
				<div className="absolute -bottom-2 -left-1.5 h-4 w-3 animate-[pulse_3s_infinite] rounded-xs border border-amber-900 bg-amber-700" />
				<div className="pointer-events-none absolute -bottom-20 -left-32 h-64 w-64 animate-[pulse_3.5s_infinite_ease-in-out] bg-radial from-amber-500/15 via-orange-600/5 to-transparent blur-2xl" />
			</div>

			{/* Floating Ember Particles */}
			<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-35 select-none">
				{embers.map((ember) => (
					<div
						key={ember.id}
						className={`absolute ${ember.size} ${ember.color} ${ember.blur} animate-ember rounded-full`}
						style={{
							left: ember.left,
							bottom: ember.bottom,
							animationDelay: ember.delay,
							animationDuration: ember.duration,
						}}
					/>
				))}
			</div>

			{/* Page Content Layout */}
			<div className="relative z-10 flex min-h-dvh flex-col">
				<main className="flex flex-1 flex-col">{children}</main>

				{/* Timber Floor Footer Frame */}
				<footer className="relative mt-auto border-t-8 border-[#2c1d15] bg-linear-to-b from-[#211610] to-[#150e0a]">
					<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_95%,#000_95%),linear-gradient(to_right,transparent_98%,#3a2418_98%)] bg-size-[240px_100%] opacity-25" />
					<div className="relative z-10 px-4 py-4 md:py-6 text-center text-xs font-sans uppercase tracking-[0.25em] text-amber-600/70">
						✦ High Chamber Operations • Decreed by Dominic Herce ✦
					</div>
				</footer>
			</div>
		</div>
	);
}

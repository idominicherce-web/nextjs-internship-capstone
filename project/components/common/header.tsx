"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import Link from "next/link";

export function Header() {
	const { isSignedIn } = useAuth();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-[#3B2415] bg-[#1A120C]/90 backdrop-blur-md px-4 py-3 font-serif shadow-xl">
			<div className="container mx-auto flex items-center justify-between">
				{/* Brand Logo */}
				<Link href="/" className="flex items-center gap-2.5 group">
					<div className="flex h-8 w-8 items-center justify-center rounded-xs border border-[#D7B05C] bg-[#2D1B10] shadow-md group-hover:border-[#FFF5D6] transition-colors">
						<Shield
							size={18}
							className="text-[#D7B05C] group-hover:text-[#FFF5D6] transition-colors"
						/>
					</div>
					<span className="font-serif font-black uppercase text-sm tracking-widest text-[#F8EEDB] group-hover:text-[#D7B05C] transition-colors">
						The Roundtable
					</span>
				</Link>

				{/* Header Actions */}
				<div className="flex items-center gap-3">
					{isSignedIn ? (
						<div className="flex items-center gap-3 font-sans text-xs">
							<Link
								href="/dashboard"
								className="rounded-xs border border-[#8F6236] bg-[#2D1B10] px-3 py-1.5 font-bold uppercase tracking-wider text-[#D7B05C] hover:bg-[#3B2415] hover:text-[#FFF5D6] transition-colors"
							>
								Dashboard
							</Link>
							<UserButton
								appearance={{
									elements: {
										avatarBox: "w-8 h-8 border border-[#D7B05C]",
									},
								}}
							/>
						</div>
					) : (
						<Link
							href="/sign-in"
							className="rounded-xs border border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] px-4 py-1.5 font-sans text-xs font-black uppercase tracking-wider text-[#F8EEDB] hover:border-[#FFF5D6] transition-colors"
						>
							Enter Realm
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}

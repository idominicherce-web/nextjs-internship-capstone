"use client";

import { useAuth } from "@clerk/nextjs";
import { Loader2, Shield, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AcceptInvitationContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const ticket = searchParams.get("__clerk_ticket");
	const statusParam = searchParams.get("__clerk_status");

	const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isAuthLoaded) return;

		// 1. Validate parameters
		const isValidStatus =
			statusParam === "sign_in" ||
			statusParam === "sign_up" ||
			statusParam === "complete";

		if (!isValidStatus || (!ticket && statusParam !== "complete")) {
			setError(
				"This workspace summons link is invalid, expired, or missing required invitation parameters.",
			);
			return;
		}

		// 2. Handle status: "complete" (User accepted or is already authenticated)
		if (statusParam === "complete") {
			if (isSignedIn) {
				router.push("/dashboard");
			} else {
				router.push("/sign-in");
			}
			return;
		}

		// 3. Construct target URL preserving the ticket query parameter
		const targetPath = statusParam === "sign_in" ? "/sign-in" : "/sign-up";
		const destination = `${targetPath}?__clerk_ticket=${encodeURIComponent(
			ticket!,
		)}&__clerk_status=${encodeURIComponent(statusParam)}`;

		// Forward to Clerk Sign-In / Sign-Up route
		router.replace(destination);
	}, [ticket, statusParam, isAuthLoaded, isSignedIn, router]);

	return (
		<div className="w-full max-w-md bg-[#1A120C] border-2 border-[#8F6236] p-6 sm:p-8 rounded-xs shadow-2xl text-[#F8EEDB]">
			{/* Brand Header */}
			<div className="flex flex-col items-center text-center mb-6">
				<div className="p-2.5 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md mb-3">
					<Shield size={28} />
				</div>
				<h1 className="text-xl sm:text-2xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wide">
					Roundtable
				</h1>
				<p className="text-[10px] font-sans font-bold text-[#E3C279] uppercase tracking-wider mt-1">
					Royal Summons Redirect
				</p>
			</div>

			{/* Loading State */}
			{!error && (
				<div className="flex flex-col items-center justify-center py-8 space-y-3">
					<Loader2 className="w-8 h-8 text-[#D7B05C] animate-spin" />
					<p className="text-xs font-serif italic text-[#E3C279]">
						Routing to authentication portal...
					</p>
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className="space-y-4">
					<div className="p-4 rounded-xs border border-red-800/80 bg-red-950/40 text-red-200 flex items-start gap-3">
						<ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
						<div className="text-xs font-sans">
							<span className="font-bold block uppercase mb-1">
								Summons Error
							</span>
							{error}
						</div>
					</div>
					<button
						type="button"
						onClick={() => router.push("/sign-in")}
						className="w-full py-2.5 border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer"
					>
						Return to Sign In
					</button>
				</div>
			)}
		</div>
	);
}

export default function AcceptInvitationPage() {
	return (
		<div className="min-h-screen bg-[#15100C] flex flex-col items-center justify-center p-4 selection:bg-[#D7B05C] selection:text-[#15100C]">
			<Suspense
				fallback={
					<div className="p-8 bg-[#1A120C] border-2 border-[#8F6236] text-[#D7B05C] rounded-xs flex items-center gap-3">
						<Loader2 className="w-5 h-5 animate-spin" />
						<span className="text-xs font-sans font-bold uppercase">
							Validating Summons...
						</span>
					</div>
				}
			>
				<AcceptInvitationContent />
			</Suspense>
		</div>
	);
}

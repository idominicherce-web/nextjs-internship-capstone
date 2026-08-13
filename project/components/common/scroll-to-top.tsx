"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
	const pathname = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is used to trigger re-execution on navigation
	useEffect(() => {
		// Scroll window to top instantly upon route change
		window.scrollTo(0, 0);

		// Reset scroll position for any scrollable main container
		const mainContent = document.querySelector("main");
		if (mainContent) {
			mainContent.scrollTop = 0;
		}
	}, [pathname]);

	return null;
}

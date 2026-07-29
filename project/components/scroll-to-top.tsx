"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
	const _pathname = usePathname();

	useEffect(() => {
		// Scroll the window to the top instantly upon route change
		window.scrollTo(0, 0);

		// Also reset scroll position for any scrollable main containers
		const mainContent = document.querySelector("main");
		if (mainContent) {
			mainContent.scrollTop = 0;
		}
	}, []);

	return null;
}

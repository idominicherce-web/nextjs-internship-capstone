import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Roundtable: Project Management Tool",
	description: "Team collaboration and project management platform",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={inter.className}>
					{/* Global Scroll-to-Top Handler */}
					<ScrollToTop />
					<ThemeProvider>{children}</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}

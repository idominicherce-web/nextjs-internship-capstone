import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Task 2.2 - Public routes accessible without signing in
const isPublicRoute = createRouteMatcher([
	"/",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/portfolio(.*)",
	"/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
	// Redirect unauthenticated users trying to access protected routes (e.g. /dashboard, /projects)
	if (!isPublicRoute(req)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and static files
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};

import { expect, test } from "@playwright/test";

test.describe("Protected Route Security Guards", () => {
	test("redirects unauthenticated users trying to access /dashboard to sign-in page", async ({
		page,
	}) => {
		await page.goto("/dashboard");
		await expect(page).toHaveURL(/.*sign-in/);
	});

	test("redirects unauthenticated users trying to access /projects to sign-in page", async ({
		page,
	}) => {
		await page.goto("/projects");
		await expect(page).toHaveURL(/.*sign-in/);
	});

	test("redirects unauthenticated users trying to access /analytics to sign-in page", async ({
		page,
	}) => {
		await page.goto("/analytics");
		await expect(page).toHaveURL(/.*sign-in/);
	});

	test("redirects unauthenticated users trying to access /settings to sign-in page", async ({
		page,
	}) => {
		await page.goto("/settings");
		await expect(page).toHaveURL(/.*sign-in/);
	});
});
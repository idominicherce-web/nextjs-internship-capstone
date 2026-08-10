import { expect, test } from "@playwright/test";

test.describe("Modal Overlay Interactivity", () => {
	test("sign-in page renders Clerk authentication card cleanly", async ({
		page,
	}) => {
		await page.goto("/sign-in");
		await expect(page.locator(".cl-card").first()).toBeVisible({
			timeout: 10000,
		});
	});
});
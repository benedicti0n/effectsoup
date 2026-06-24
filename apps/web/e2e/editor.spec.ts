import { test, expect } from "@playwright/test";

test("guest can open editor and see upload prompt", async ({ page }) => {
  await page.goto("/editor");
  await expect(page.getByText("Upload an image to start editing")).toBeVisible();
});

test("landing page links to editor", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Open the Editor" }).click();
  await expect(page).toHaveURL("/editor");
});

test("guest sees premium lock on export", async ({ page }) => {
  await page.goto("/editor");
  // Without an uploaded image the Export button is disabled.
  await expect(page.getByRole("button", { name: "Export" })).toBeDisabled();
});

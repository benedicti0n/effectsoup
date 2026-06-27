import { test, expect } from "@playwright/test";

test("guest can open editor and see upload prompt", async ({ page }) => {
  await page.goto("/editor");
  await expect(page.getByText("Upload an image to start editing")).toBeVisible();
});

test("landing page links to playground", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Open Playground" }).first().click();
  await expect(page).toHaveURL("/playground");
});

test("guest can open playground and see upload prompt", async ({ page }) => {
  await page.goto("/playground");
  await expect(page.getByText("Upload an image to start editing")).toBeVisible();
});

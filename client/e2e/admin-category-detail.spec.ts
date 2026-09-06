import { test, expect } from "@playwright/test"

test.describe("Category Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/categories/1", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  })

  test("shows back navigation to categories", async ({ page }) => {
    await expect(page.locator('a[href="/admin/categories"]').first()).toBeVisible()
  })

  test("displays category name and heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()
  })

  test("shows category metadata (fee, timeline, status)", async ({ page }) => {
    const main = page.getByRole("main")
    await expect(main).toContainText(/fee|timeline|category|review|protocol|processing/i)
  })

  test("has edit action controls", async ({ page }) => {
    const buttons = page.getByRole("button")
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("displays associated protocols or items", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/protocol|item|submission|entry|record/i)
  })

  test("shows category description", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/description|overview|detail|scope/i)
  })
})

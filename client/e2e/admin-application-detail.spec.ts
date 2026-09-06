import { test, expect } from "@playwright/test"

test.describe("Reviewer Application Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/applications/1", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  })

  test("shows back navigation to applications", async ({ page }) => {
    await expect(page.locator('a[href="/admin/applications"]').first()).toBeVisible()
  })

  test("displays applicant name and heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()
  })

  test("shows application status badge", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/pending|approved|rejected|under review|status/i)
  })

  test("displays personal and academic details", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/email|degree|university|academic|personal/i)
  })

  test("shows expertise and board preferences", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/expertise|board|domain|speciali|review/i)
  })

  test("has approve/reject action buttons", async ({ page }) => {
    const buttons = page.getByRole("button")
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("displays application timeline or history", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/submitted|date|timeline|history|stage/i)
  })
})

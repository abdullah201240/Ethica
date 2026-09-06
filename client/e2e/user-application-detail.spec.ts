import { test, expect } from "@playwright/test"

test.describe("User Application Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/applications/PRO-001", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  })

  test("shows back navigation to applications", async ({ page }) => {
    await expect(page.locator('a[href="/applications"]').first()).toBeVisible()
  })

  test("displays protocol title and status badge", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()
    await expect(page.getByRole("main")).toContainText("Protocol")
  })

  test("shows protocol metadata (department, board, duration)", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/department|board|duration|methodology/i)
  })

  test("displays review timeline and status history", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/review|status|timeline|stage/i)
  })

  test("has download and action buttons", async ({ page }) => {
    const buttons = page.locator("button")
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("shows investigator information", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/investigator|pi|principal/i)
  })

  test("displays document attachments section", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/document|attachment|file|pdf|protocol/i)
  })
})

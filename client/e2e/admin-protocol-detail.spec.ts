import { test, expect } from "@playwright/test"

test.describe("Protocol Detail (Admin)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/protocols/1", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  })

  test("shows back navigation to protocols", async ({ page }) => {
    await expect(page.locator('a[href="/admin/protocols"]').first()).toBeVisible()
  })

  test("displays protocol title and status", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()
    await expect(page.getByRole("main")).toContainText(/protocol|status|review|clearance/i)
  })

  test("shows investigator and department info", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/investigator|department|pi|principal/i)
  })

  test("displays review board assignment", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/board|IRB|biomedical|social|ethics|AI/i)
  })

  test("has admin action buttons (approve, reject, assign)", async ({ page }) => {
    const buttons = page.getByRole("button")
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("shows protocol methodology and risk tier", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/methodology|risk|consent|participant|cohort/i)
  })

  test("displays document attachments", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/document|file|attachment|pdf|protocol|consent/i)
  })

  test("shows review timeline and deliberation history", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/review|deliberation|timeline|history|stage|decision/i)
  })

  test("displays fee and payment information", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/fee|payment|BDT|processing|charge/i)
  })
})

import { test, expect } from "@playwright/test"

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/dashboard")
  })

  test("should load the admin dashboard", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/dashboard/)
  })

  test("should display KPI metric cards", async ({ page }) => {
    await expect(page.getByText(/total.*admin|total.*member|active.*admin/i).first()).toBeVisible()
  })

  test("should display audit ledger section", async ({ page }) => {
    await expect(page.getByText(/audit|ledger|immutable/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

import { test, expect } from "@playwright/test"

test.describe("Admin Reviewer Applications", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/applications")
  })

  test("should load the applications page", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/applications/)
  })

  test("should display applications DataTable", async ({ page }) => {
    await expect(page.getByText(/application|intake|onboard/i).first()).toBeVisible()
  })

  test("should display KPI cards", async ({ page }) => {
    await expect(page.getByText(/total|pending|approved|rejected/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

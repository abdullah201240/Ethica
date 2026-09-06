import { test, expect } from "@playwright/test"

test.describe("Admin Protocol Applications", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/protocols")
  })

  test("should load the protocols page", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/protocols/)
  })

  test("should display protocols DataTable", async ({ page }) => {
    await expect(page.getByText(/protocol|docket|submission/i).first()).toBeVisible()
  })

  test("should display KPI cards for protocol metrics", async ({ page }) => {
    await expect(page.getByText(/total|under review|clearance|revision/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

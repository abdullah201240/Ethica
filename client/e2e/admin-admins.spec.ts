import { test, expect } from "@playwright/test"

test.describe("Admin Members Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/admins")
  })

  test("should load the admins page", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/admins/)
  })

  test("should display admin members DataTable", async ({ page }) => {
    await expect(page.getByText(/admin.*member|governance.*admin|administrator/i).first()).toBeVisible()
  })

  test("should display KPI cards for admin metrics", async ({ page }) => {
    await expect(page.getByText(/total.*admin|active/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

import { test, expect } from "@playwright/test"

test.describe("Admin Research Categories", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/categories")
  })

  test("should load the categories page", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/categories/)
  })

  test("should display categories DataTable", async ({ page }) => {
    await expect(page.getByText(/categor|research.*domain|classification/i).first()).toBeVisible()
  })

  test("should display KPI cards for category metrics", async ({ page }) => {
    await expect(page.getByText(/total.*categor|active.*categor/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

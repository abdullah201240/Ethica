import { test, expect } from "@playwright/test"

test.describe("Admin Reviewer Roster", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/roster")
  })

  test("should load the roster page", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/roster/)
  })

  test("should display reviewer roster DataTable", async ({ page }) => {
    await expect(page.getByText(/reviewer.*roster|accredited.*reviewer|committee.*roster/i).first()).toBeVisible()
  })

  test("should display KPI cards for reviewer metrics", async ({ page }) => {
    await expect(page.getByText(/total.*reviewer|active.*reviewer/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

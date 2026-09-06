import { test, expect } from "@playwright/test"

test.describe("Reviewer Completed Reviews", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reviewer/completed")
  })

  test("should load the completed page", async ({ page }) => {
    await expect(page).toHaveURL(/\/reviewer\/completed/)
  })

  test("should display KPI metric cards", async ({ page }) => {
    await expect(page.getByText(/completed|resolved|closed|finalized/i).first()).toBeVisible()
  })

  test("should display completed reviews DataTable", async ({ page }) => {
    await expect(page.getByText(/completed|protocol|evaluation|determination/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

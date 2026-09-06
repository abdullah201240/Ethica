import { test, expect } from "@playwright/test"

test.describe("Reviewer Deliberations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reviewer/deliberations")
  })

  test("should load the deliberations page", async ({ page }) => {
    await expect(page).toHaveURL(/\/reviewer\/deliberations/)
  })

  test("should display KPI metric cards", async ({ page }) => {
    await expect(page.getByText(/deliberation|evaluation|vote|consensus/i).first()).toBeVisible()
  })

  test("should display deliberation items or table", async ({ page }) => {
    await expect(page.getByText(/protocol|deliberation|evaluation|review/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

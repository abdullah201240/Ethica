import { test, expect } from "@playwright/test"

test.describe("Reviewer Requests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reviewer/requests")
  })

  test("should load the requests page", async ({ page }) => {
    await expect(page).toHaveURL(/\/reviewer\/requests/)
  })

  test("should display KPI metric cards", async ({ page }) => {
    await expect(page.getByText(/request|pending|assigned|inbox/i).first()).toBeVisible()
  })

  test("should display review request items", async ({ page }) => {
    await expect(page.getByText(/protocol|review|request|assignment/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

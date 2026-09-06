import { test, expect } from "@playwright/test"

test.describe("Reviewer Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reviewer/dashboard")
  })

  test("should load the reviewer dashboard", async ({ page }) => {
    await expect(page).toHaveURL(/\/reviewer\/dashboard/)
  })

  test("should display KPI metric cards", async ({ page }) => {
    await expect(page.getByText(/assigned|pending|deliberation|completed|active/i).first()).toBeVisible()
  })

  test("should display protocol assignment cards or table", async ({ page }) => {
    await expect(page.getByText(/protocol|assignment|docket|review/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

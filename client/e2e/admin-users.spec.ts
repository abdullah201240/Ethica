import { test, expect } from "@playwright/test"

test.describe("Admin Users Directory", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/users")
  })

  test("should load the users page", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/users/)
  })

  test("should display users DataTable", async ({ page }) => {
    await expect(page.getByText(/user.*director|platform.*user|registered/i).first()).toBeVisible()
  })

  test("should display KPI cards for user metrics", async ({ page }) => {
    await expect(page.getByText(/total.*user|active.*user|verified/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

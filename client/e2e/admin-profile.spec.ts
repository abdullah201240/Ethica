import { test, expect } from "@playwright/test"

test.describe("Admin Profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/profile")
  })

  test("should load the admin profile page", async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/profile/)
  })

  test("should display profile identity section", async ({ page }) => {
    await expect(page.getByText(/admin.*profile|administrator.*profile|governance.*profile/i).first()).toBeVisible()
  })

  test("should display session/activity logs section", async ({ page }) => {
    await expect(page.getByText(/session|device|login.*history|activity/i).first()).toBeVisible()
  })

  test("should have security/change password section", async ({ page }) => {
    await expect(page.getByText(/password|security|passphrase|credential/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

import { test, expect } from "@playwright/test"

test.describe("Reviewer Application (Accreditation)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reviewer/apply")
  })

  test("should load the reviewer application page", async ({ page }) => {
    await expect(page).toHaveURL(/\/reviewer\/apply/)
  })

  test("should display the application form header", async ({ page }) => {
    await expect(page.getByText(/accreditation|onboard|application|reviewer.*apply/i).first()).toBeVisible()
  })

  test("should display personal details section", async ({ page }) => {
    await expect(page.getByText(/personal|name|email|credential/i).first()).toBeVisible()
  })

  test("should have form input fields", async ({ page }) => {
    const inputs = page.locator("input, textarea")
    const count = await inputs.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

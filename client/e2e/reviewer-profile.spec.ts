import { test, expect } from "@playwright/test"

test.describe("Reviewer Profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reviewer/profile")
  })

  test("should load the reviewer profile page", async ({ page }) => {
    await expect(page).toHaveURL(/\/reviewer\/profile/)
  })

  test("should display reviewer identity section", async ({ page }) => {
    await expect(page.getByText(/reviewer.*profile|committee.*dossier|member.*profile|accreditation/i).first()).toBeVisible()
  })

  test("should display credential/badge information", async ({ page }) => {
    await expect(page.getByText(/credential|badge|speciali|board|domain/i).first()).toBeVisible()
  })

  test("should have tab navigation for profile sections", async ({ page }) => {
    const tabs = page.getByRole("tab")
    const count = await tabs.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

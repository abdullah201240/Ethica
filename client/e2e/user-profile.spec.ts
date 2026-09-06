import { test, expect } from "@playwright/test"

test.describe("User Profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/profile")
  })

  test("should load the profile page", async ({ page }) => {
    await expect(page).toHaveURL(/\/profile/)
  })

  test("should display profile header with user identity", async ({ page }) => {
    // Profile page should show some form of user identity or profile section
    await expect(page.getByText(/investigator.*profile|profile|researcher.*dossier/i).first()).toBeVisible()
  })

  test("should display tab or section navigation for profile", async ({ page }) => {
    // Profile uses Tabs or sectioned layout — check for multiple navigable sections
    const tabs = page.getByRole("tab")
    const tabButtons = page.locator("button[role='tab'], [data-state='active'], [data-state='inactive']")
    const tabCount = await tabs.count()
    const buttonCount = await tabButtons.count()
    expect(tabCount + buttonCount).toBeGreaterThanOrEqual(2)
  })

  test("should display avatar/photo section", async ({ page }) => {
    await expect(page.getByText(/avatar|photo|profile.*image/i).first()).toBeVisible()
  })

  test("should have contact information fields", async ({ page }) => {
    await expect(page.getByText(/contact|email|phone/i).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

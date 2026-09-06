import { test, expect } from "@playwright/test"

/** Helper: check if the current test project is a mobile viewport */
function isMobileProject() {
  const name = test.info().project.name
  return name === "mobile-chrome" || name === "mobile-safari"
}

test.describe("Landing Page", () => {
  test("should load the landing page successfully", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Ethica/i)
  })

  test("should display the ETHICA branding", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("ETHICA").first()).toBeVisible()
  })

  test("should have desktop navigation links on desktop viewports", async ({ page }) => {
    test.skip(isMobileProject(), "Desktop nav hidden on mobile")
    await page.goto("/")
    await expect(page.getByRole("link", { name: /researcher sign in/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /irb portal/i })).toBeVisible()
  })

  test("should have hamburger menu on mobile viewports", async ({ page }) => {
    test.skip(!isMobileProject(), "Hamburger only on mobile")
    await page.goto("/")
    await expect(page.getByRole("button", { name: /toggle navigation menu/i })).toBeVisible()
  })

  test("should reveal mobile nav links after hamburger toggle", async ({ page }) => {
    test.skip(!isMobileProject(), "Hamburger only on mobile")
    await page.goto("/")
    await page.getByRole("button", { name: /toggle navigation menu/i }).click()
    await expect(page.getByRole("link", { name: /researcher.*user login/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /irb committee reviewer login/i })).toBeVisible()
  })

  test("should navigate to user login", async ({ page }) => {
    await page.goto("/")

    if (isMobileProject()) {
      await page.getByRole("button", { name: /toggle navigation menu/i }).click()
      await page.getByRole("link", { name: /researcher.*user login/i }).click()
    } else {
      await page.getByRole("link", { name: /researcher sign in/i }).click()
    }
    await expect(page).toHaveURL(/\/login/)
  })

  test("should navigate to reviewer login", async ({ page }) => {
    await page.goto("/")

    if (isMobileProject()) {
      await page.getByRole("button", { name: /toggle navigation menu/i }).click()
      await page.getByRole("link", { name: /irb committee reviewer login/i }).click()
    } else {
      await page.getByRole("link", { name: /irb portal/i }).click()
    }
    await expect(page).toHaveURL(/\/reviewer\/login/)
  })

  test("should not have horizontal scroll on desktop", async ({ page }) => {
    await page.goto("/")
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test("should not have horizontal scroll on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

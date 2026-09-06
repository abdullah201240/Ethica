import { test, expect } from "@playwright/test"

test.describe("Investigator / User Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
  })

  test("should display the login page with ETHICA branding", async ({ page }) => {
    await expect(page.getByText("ETHICA").first()).toBeVisible()
    await expect(page.getByText("Investigator Portal")).toBeVisible()
  })

  test("should display the sign-in form with email and password fields", async ({ page }) => {
    await expect(page.getByLabel(/institutional email/i)).toBeVisible()
    await expect(page.getByLabel(/^password$/i)).toBeVisible()
  })

  test("should autofill demo credentials when clicking Autofill button", async ({ page }) => {
    await page.getByRole("button", { name: /autofill demo pi/i }).click()

    const emailInput = page.getByLabel(/institutional email/i)
    const passwordInput = page.getByLabel(/^password$/i)

    await expect(emailInput).toHaveValue("elena.rostova@diu.edu.bd")
    await expect(passwordInput).toHaveValue("EthicaSecure2026!")
  })

  test("should show status message after demo autofill", async ({ page }) => {
    await page.getByRole("button", { name: /autofill demo pi/i }).click()
    await expect(page.getByText(/demo principal investigator credentials loaded/i)).toBeVisible()
  })

  test("should redirect to dashboard after successful login", async ({ page }) => {
    // Autofill and submit
    await page.getByRole("button", { name: /autofill demo pi/i }).click()
    await page.getByRole("button", { name: /access researcher workspace/i }).click()

    // Wait for authentication simulation to complete (1.2s auth + 1s redirect)
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })
  })

  test("should toggle password visibility", async ({ page }) => {
    const passwordInput = page.locator("#password")
    await passwordInput.fill("TestPassword123!")

    // Password should be hidden initially
    await expect(passwordInput).toHaveAttribute("type", "password")

    // Click the toggle button
    await page.getByRole("button", { name: /toggle password visibility/i }).click()
    await expect(passwordInput).toHaveAttribute("type", "text")

    // Click again to hide
    await page.getByRole("button", { name: /toggle password visibility/i }).click()
    await expect(passwordInput).toHaveAttribute("type", "password")
  })

  test("should have link to reviewer portal", async ({ page }) => {
    await expect(page.getByRole("link", { name: /committee login/i })).toBeVisible()
  })

  test("should navigate to reviewer login", async ({ page }) => {
    await page.getByRole("link", { name: /committee login/i }).click()
    await expect(page).toHaveURL(/\/reviewer\/login/)
  })

  test("should have link back to home", async ({ page }) => {
    // On mobile, "Home" text is hidden (sm:inline); accessible name is "Back to"
    // On desktop, full text is "Back to Home"
    const backLink = page.locator('a[href="/"]').filter({ hasText: "Back to" })
    await expect(backLink).toBeVisible()
  })

  test("should display Google SSO button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /continue with google/i })).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

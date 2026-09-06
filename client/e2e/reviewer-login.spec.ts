import { test, expect } from "@playwright/test"

test.describe("Reviewer Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reviewer/login")
  })

  test("should display the reviewer login page with ETHICA branding", async ({ page }) => {
    await expect(page.getByText("ETHICA").first()).toBeVisible()
    await expect(page.getByText("IRB Committee Portal")).toBeVisible()
  })

  test("should display the reviewer sign-in form", async ({ page }) => {
    await expect(page.getByLabel(/committee member email/i)).toBeVisible()
    await expect(page.getByLabel(/institutional passphrase/i)).toBeVisible()
  })

  test("should autofill demo reviewer credentials", async ({ page }) => {
    await page.getByRole("button", { name: /autofill irb chair/i }).click()

    const emailInput = page.getByLabel(/committee member email/i)
    const passwordInput = page.getByLabel(/institutional passphrase/i)

    await expect(emailInput).toHaveValue("charles.montgomery@diu.edu.bd")
    await expect(passwordInput).toHaveValue("IRB_Chair_SecureKey_2026!")
  })

  test("should show status message after reviewer demo autofill", async ({ page }) => {
    await page.getByRole("button", { name: /autofill irb chair/i }).click()
    await expect(page.getByText(/demo committee chair credentials loaded/i)).toBeVisible()
  })

  test("should redirect to reviewer dashboard after successful login", async ({ page }) => {
    await page.getByRole("button", { name: /autofill irb chair/i }).click()
    await page.getByRole("button", { name: /access deliberation chamber/i }).click()

    await expect(page).toHaveURL(/\/reviewer\/dashboard/, { timeout: 10_000 })
  })

  test("should toggle passphrase visibility", async ({ page }) => {
    const passwordInput = page.getByLabel(/institutional passphrase/i)
    await passwordInput.fill("TestReviewerPass123!")

    await expect(passwordInput).toHaveAttribute("type", "password")

    await page.getByRole("button", { name: /toggle password visibility/i }).click()
    await expect(passwordInput).toHaveAttribute("type", "text")

    await page.getByRole("button", { name: /toggle password visibility/i }).click()
    await expect(passwordInput).toHaveAttribute("type", "password")
  })

  test("should have link to researcher/user portal", async ({ page }) => {
    await expect(page.getByRole("link", { name: /researcher login/i })).toBeVisible()
  })

  test("should navigate to user login", async ({ page }) => {
    await page.getByRole("link", { name: /researcher login/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test("should display footer security badges", async ({ page }) => {
    await expect(page.getByText(/cryptographically audited/i)).toBeVisible()
    await expect(page.getByText(/institutional quorum access/i)).toBeVisible()
  })
})

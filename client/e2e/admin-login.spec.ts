import { test, expect } from "@playwright/test"

test.describe("Admin Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/login")
  })

  test("should display the admin login page with ETHICA branding", async ({ page }) => {
    await expect(page.getByText("ETHICA").first()).toBeVisible()
    await expect(page.getByText("Governance Administration")).toBeVisible()
  })

  test("should display the admin sign-in form", async ({ page }) => {
    await expect(page.getByLabel(/administrator email/i)).toBeVisible()
    await expect(page.getByLabel(/master administrative passphrase/i)).toBeVisible()
  })

  test("should autofill demo admin credentials", async ({ page }) => {
    await page.getByRole("button", { name: /autofill admin/i }).click()

    const emailInput = page.getByLabel(/administrator email/i)
    const passwordInput = page.getByLabel(/master administrative passphrase/i)

    await expect(emailInput).toHaveValue("admin.secretariat@diu.edu.bd")
    await expect(passwordInput).toHaveValue("EthicaAdminMaster2026!")
  })

  test("should show status message after admin demo autofill", async ({ page }) => {
    await page.getByRole("button", { name: /autofill admin/i }).click()
    await expect(page.getByText(/demo compliance administrator credentials loaded/i)).toBeVisible()
  })

  test("should redirect to admin dashboard after successful login", async ({ page }) => {
    await page.getByRole("button", { name: /autofill admin/i }).click()
    await page.getByRole("button", { name: /access institutional console/i }).click()

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10_000 })
  })

  test("should toggle passphrase visibility", async ({ page }) => {
    const passwordInput = page.getByLabel(/master administrative passphrase/i)
    await passwordInput.fill("TestAdminPass123!")

    await expect(passwordInput).toHaveAttribute("type", "password")

    await page.getByRole("button", { name: /toggle password visibility/i }).click()
    await expect(passwordInput).toHaveAttribute("type", "text")

    await page.getByRole("button", { name: /toggle password visibility/i }).click()
    await expect(passwordInput).toHaveAttribute("type", "password")
  })

  test("should have links to other portals", async ({ page }) => {
    await expect(page.getByRole("link", { name: /researcher portal/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /irb committee portal/i })).toBeVisible()
  })

  test("should navigate to reviewer login from portal links", async ({ page }) => {
    await page.getByRole("link", { name: /irb committee portal/i }).click()
    await expect(page).toHaveURL(/\/reviewer\/login/)
  })

  test("should navigate to user login from portal links", async ({ page }) => {
    await page.getByRole("link", { name: /researcher portal/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})

import { test, expect } from "@playwright/test"

test.describe("User Apply — Protocol Application Wizard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/apply")
  })

  test("should load the apply page", async ({ page }) => {
    await expect(page).toHaveURL(/\/apply/)
  })

  test("should display the 5-step wizard stepper", async ({ page }) => {
    await expect(page.getByText("Protocol Scope").first()).toBeVisible()
    await expect(page.getByText("Methodology & Risk").first()).toBeVisible()
    await expect(page.getByText("Dossier Attachments").first()).toBeVisible()
    await expect(page.getByText(/Processing Fee/i).first()).toBeVisible()
    await expect(page.getByText("Review & Submit").first()).toBeVisible()
  })

  test("should start at Step 1 by default", async ({ page }) => {
    await expect(page.getByText(/protocol scope/i).first()).toBeVisible()
  })

  test("should display Step 1 form fields", async ({ page }) => {
    // Check for the step heading
    await expect(page.getByRole("heading", { name: /step 1.*protocol scope/i }).first()).toBeVisible()
    // Department field
    await expect(page.getByText(/department/i).first()).toBeVisible()
    // Ethics board selection
    await expect(page.getByText(/ethics board|governance board/i).first()).toBeVisible()
  })

  test("should have navigation buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: /continue|next/i }).first()).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

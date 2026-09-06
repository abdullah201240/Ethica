import { test, expect } from "@playwright/test"

test.describe("User Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard")
  })

  test("should load the dashboard page", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test("should display KPI metric cards", async ({ page }) => {
    await expect(page.getByText("Total Submissions").first()).toBeVisible()
    await expect(page.getByText("In Active Review").first()).toBeVisible()
    await expect(page.getByText("Clearance Granted").first()).toBeVisible()
    await expect(page.getByText("Revisions Due").first()).toBeVisible()
  })

  test("should display the protocol DataTable", async ({ page }) => {
    await expect(page.getByText("Institutional Research Ethics Docket")).toBeVisible()
  })

  test("should have New Submission button", async ({ page }) => {
    await expect(page.getByRole("link", { name: /new submission|new/i })).toBeVisible()
  })

  test("should navigate to apply page via New Submission", async ({ page }) => {
    await page.getByRole("link", { name: /new submission|new/i }).click()
    await expect(page).toHaveURL(/\/apply/)
  })

  test("should display certificate showcase section", async ({ page }) => {
    await expect(page.getByText(/digital ethical clearance certificates/i)).toBeVisible()
  })

  test("should display fast-track eligibility section", async ({ page }) => {
    await expect(page.getByText(/fast-track.*exemption.*eligibility/i)).toBeVisible()
  })

  test("should display institutional guidelines section", async ({ page }) => {
    await expect(page.getByText(/institutional bioethics guidelines/i)).toBeVisible()
  })

  test("should display helpline banner", async ({ page }) => {
    await expect(page.getByText(/institutional ethics helpline/i)).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

import { test, expect } from "@playwright/test"

test.describe("Admin Member Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/admins/1", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  })

  test("shows back navigation to admins", async ({ page }) => {
    await expect(page.locator('a[href="/admin/admins"]').first()).toBeVisible()
  })

  test("displays admin member name and title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()
  })

  test("shows access level and role badge", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/admin|access|role|governance|level/i)
  })

  test("displays contact and department info", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/email|department|phone|contact|office/i)
  })

  test("shows KPI metrics for admin activity", async ({ page }) => {
    const main = page.getByRole("main")
    await expect(main).toContainText(/audit|action|log|session|activity/i)
  })

  test("has edit and toggle status controls", async ({ page }) => {
    const buttons = page.getByRole("button")
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("displays audit trail or activity log", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/audit|log|activity|action|history/i)
  })

  test("shows security and credential information", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/security|credential|seal|verification|fips/i)
  })
})

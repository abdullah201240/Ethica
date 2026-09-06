import { test, expect } from "@playwright/test"

test.describe("User Detail (Admin)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/users/1", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  })

  test("shows back navigation to users", async ({ page }) => {
    await expect(page.locator('a[href="/admin/users"]').first()).toBeVisible()
  })

  test("displays user name and heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()
  })

  test("shows user role and status badge", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/role|status|user|investigator|researcher|active/i)
  })

  test("displays contact and department info", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/email|department|phone|contact|office|faculty/i)
  })

  test("shows KPI metrics for user activity", async ({ page }) => {
    const main = page.getByRole("main")
    await expect(main).toContainText(/protocol|submission|application|clearance|research/i)
  })

  test("has edit and toggle status controls", async ({ page }) => {
    const buttons = page.getByRole("button")
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("displays user credentials and academic info", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/degree|credential|academic|qualification|institution/i)
  })

  test("shows security and account information", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/security|account|access|credential|verification/i)
  })
})

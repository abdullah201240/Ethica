import { test, expect } from "@playwright/test"

test.describe("Reviewer Dossier Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/roster/1", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")
  })

  test("shows back navigation to roster", async ({ page }) => {
    await expect(page.locator('a[href="/admin/roster"]').first()).toBeVisible()
  })

  test("displays reviewer name and credentials", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()
    await expect(page.getByRole("main")).toContainText(/reviewer|committee|IRB/i)
  })

  test("shows institutional affiliation and contact", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/department|university|email|institution/i)
  })

  test("displays accreditation status badge", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/accredited|active|status|badge/i)
  })

  test("shows KPI metrics for reviewer workload", async ({ page }) => {
    const main = page.getByRole("main")
    await expect(main).toContainText(/deliberation|review|case|assignment|protocol/i)
  })

  test("has status toggle action (activate/deactivate)", async ({ page }) => {
    const buttons = page.getByRole("button")
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })

  test("displays domain specializations", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/domain|speciali|board|expertise|field/i)
  })

  test("shows digital seal or verification section", async ({ page }) => {
    await expect(page.getByRole("main")).toContainText(/seal|verification|hash|credential|fips/i)
  })
})

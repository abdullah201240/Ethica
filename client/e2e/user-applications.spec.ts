import { test, expect } from "@playwright/test"

test.describe("User Applications", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/applications")
  })

  test("should load the applications page", async ({ page }) => {
    await expect(page).toHaveURL(/\/applications/)
  })

  test("should display KPI metric cards", async ({ page }) => {
    await expect(page.getByText("Total Applications").first()).toBeVisible()
    await expect(page.getByText("In Deliberation").first()).toBeVisible()
    await expect(page.getByText("Clearance Granted").first()).toBeVisible()
    await expect(page.getByText("Revisions Due").first()).toBeVisible()
  })

  test("should display the applications DataTable", async ({ page }) => {
    await expect(page.getByText("Principal Investigator Applications Docket")).toBeVisible()
  })

  test("should have Apply for Permission button", async ({ page }) => {
    await expect(page.getByRole("link", { name: /apply for permission|apply/i }).first()).toBeVisible()
  })

  test("should navigate to apply page via Apply button", async ({ page }) => {
    await page.getByRole("link", { name: /apply for permission|apply/i }).first().click()
    await expect(page).toHaveURL(/\/apply/)
  })

  test("should display governance stages lifecycle guide", async ({ page }) => {
    await expect(page.getByText(/institutional review governance stages/i)).toBeVisible()
    await expect(page.getByText(/intake.*fee triage/i).first()).toBeVisible()
    await expect(page.getByText(/board assignment/i).first()).toBeVisible()
    await expect(page.getByText("3. Peer Deliberation")).toBeVisible()
    await expect(page.getByText("4. Clearance Certificate")).toBeVisible()
  })

  test("should not have horizontal scroll", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })
})

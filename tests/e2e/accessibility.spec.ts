import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * WCAG 2.2 AA automated checks (axe-core) on the pages reachable without
 * authentication, plus the post-login dashboard. This catches missing
 * labels, contrast failures and landmark issues; it does not replace manual
 * keyboard-navigation and screen-reader testing (see docs/KNOWN_LIMITATIONS.md).
 */

async function expectNoSeriousViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  if (serious.length > 0) {
    console.log(JSON.stringify(serious, null, 2));
  }
  expect(serious).toEqual([]);
}

test("landing page has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expectNoSeriousViolations(page);
});

test("register page has no serious accessibility violations", async ({ page }) => {
  await page.goto("/register");
  await expectNoSeriousViolations(page);
});

test("dashboard has no serious accessibility violations once logged in", async ({ page }) => {
  await page.goto("/register");
  await page.fill("#fullName", "Accessibility Tester");
  await page.fill("#email", `a11y+${Date.now()}@example.com`);
  await page.fill("#password", "password123");
  await page.click("button[type=submit]");
  await page.waitForURL("**/identity");
  await expectNoSeriousViolations(page);
});

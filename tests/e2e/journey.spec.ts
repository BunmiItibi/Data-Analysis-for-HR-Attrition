import { test, expect, type Page } from "@playwright/test";

/**
 * End-to-end smoke test of the critical Release 0.1 journey in demo mode:
 * register → identity → apply/accept → induction → dashboard → inbox reply
 * (AI colleague follow-up) → requirements meeting → three work products
 * (submit + evidence-linked feedback) → revision → Experience Score →
 * portfolio, plus the privacy-escalation safety-flag path.
 */

async function completeInduction(page: Page) {
  const markButtons = page.getByRole("button", { name: "Mark complete" });
  let count = await markButtons.count();
  while (count > 0) {
    await markButtons.first().click();
    await page.waitForTimeout(200);
    count = await markButtons.count();
  }
  await page.getByRole("button", { name: /Complete induction/ }).click();
}

async function registerAndReachDashboard(page: Page, emailPrefix: string) {
  await page.goto("/register");
  await page.fill("#fullName", "Bunmi Adebayo");
  await page.fill("#email", `${emailPrefix}+${Date.now()}@example.com`);
  await page.fill("#password", "password123");
  await page.click('button[type=submit]');
  await page.waitForURL("**/identity");

  await page.fill("#careerGoal", "I want to become an entry-level Digital Project Officer.");
  await page.fill("#currentSituation", "I have a business degree but no formal project experience yet.");
  await page.check('input[value="risk_and_issue_management"]');
  await page.click("text=Generate my profile");
  await page.waitForURL("**/placements");

  await page.click("text=Apply for this placement");
  await page.waitForURL("**/placements/*");
  await page.click("text=Accept placement");
  await page.waitForURL("**/induction");

  await completeInduction(page);
  await page.waitForURL("**/dashboard");
}

test("full critical journey: registration through to portfolio", async ({ page }) => {
  await registerAndReachDashboard(page, "journey");

  await expect(page.getByText("Your next step")).toBeVisible();

  // Inbox: reply to Sarah's welcome email and see her in-character follow-up
  await page.click("text=Open inbox");
  await page.waitForURL("**/inbox");
  await page.click("text=Welcome to Northstar");
  await page.waitForURL("**/inbox/*");
  await page.fill("#bodyMarkdown", "Hi Sarah, I'm Bunmi — excited to get started.");
  await page.click("text=Send reply");
  await expect(page.getByText(/replied$/)).toBeVisible({ timeout: 5000 });

  // Requirements meeting -> requirements summary
  await page.goto("/meetings/requirements-meeting");
  await expect(page.getByText("24 hours").first()).toBeVisible();
  await page.click("text=Write the requirements summary");
  await page.waitForURL("**/tasks/requirements-summary");

  await page.fill(
    "#summary",
    "The team confirmed the 24-hour cancellation notice period is in scope and agreed home address updates stay out of scope.",
  );
  await page.fill(
    "#decisions",
    "The 24-hour cancellation notice period is confirmed as in scope for this release.\nHome address updates remain out of scope for this release.",
  );
  await page.locator('input[placeholder="Action"]').first().fill("Build the notice-period check");
  await page.locator('input[placeholder="Owner"]').first().fill("Daniel Reed");
  await page.locator('input[placeholder="Due date"]').first().fill("In 3 days");
  await page.click("text=Submit for feedback");
  await page.waitForURL("**/submissions/requirements-summary/feedback");
  await expect(page.getByText(/5 —/).first()).toBeVisible();

  // RAID log
  await page.goto("/tasks/raid-log");
  const entry = page.locator("div.rounded-md.border.border-border.p-3").first();
  await entry.locator("select").nth(0).selectOption("risk");
  await entry.locator("input").nth(0).fill("Daniel Reed");
  await entry.locator("select").nth(1).selectOption("high");
  await entry.locator("textarea").nth(0).fill("Scope creep risk on the notice-period change.");
  await entry.locator("textarea").nth(1).fill("Daniel to prioritise and confirm timing with Rachel.");
  await page.click("text=Submit for feedback");
  await page.waitForURL("**/submissions/raid-log/feedback");

  // Escalation and recommendation — the privacy-critical path
  await page.goto("/tasks/escalation-recommendation");
  await page.fill(
    "#incidentSummary",
    "One patient occasionally saw another patient's appointment reference during concurrent-session testing.",
  );
  await page.fill(
    "#severityAssessment",
    "Low reproduction rate but a genuine cross-patient exposure of a reference number, which is a real data-protection concern.",
  );
  await page.fill("#peopleNotified", "James Wilson, Sarah Mitchell");
  await page.fill(
    "#recommendation",
    "I recommend the launch does not proceed until the defect is fixed and retested. This is my recommendation for Sarah and the Board.",
  );
  await page.locator('input[type=radio][name=launchReadiness]').nth(1).check(); // conditional
  await page.fill("#conditions", "Fix and retest the defect under concurrent load before go-live.");
  await page.click("text=Submit for feedback");
  await page.waitForURL("**/submissions/escalation-recommendation/feedback");

  // Escalating properly should not raise a safety flag when James Wilson was notified
  await expect(page.getByText("Safety flag")).toHaveCount(0);

  // Score and portfolio are reachable and show the disclosure statement
  await page.goto("/score");
  await expect(page.getByRole("heading", { name: "Your Experience Score" })).toBeVisible();

  await page.goto("/portfolio");
  await expect(page.getByText("This does not represent employment by Northstar Health Digital.")).toBeVisible();

  // Revision: original and revised versions both remain visible
  await page.goto("/tasks/requirements-summary");
  await page.fill("#openQuestions", "None outstanding.");
  await page.click("text=Resubmit");
  await page.waitForURL("**/submissions/requirements-summary/feedback");
  await expect(page.getByRole("heading", { name: "Original submission" })).toBeVisible();
  await expect(page.getByText(/Revision \d/)).toBeVisible();
});

test("privacy escalation: failing to notify Information Governance raises a safety flag", async ({ page }) => {
  await registerAndReachDashboard(page, "noescalate");

  await page.goto("/tasks/escalation-recommendation");
  await page.fill("#incidentSummary", "A defect was found where appointment references were occasionally mixed up.");
  await page.fill("#severityAssessment", "Low reproduction rate, probably not a big deal.");
  await page.fill("#peopleNotified", "Daniel Reed");
  await page.fill("#recommendation", "I recommend we go live as planned since most testing passed.");
  await page.locator('input[type=radio][name=launchReadiness]').nth(0).check(); // ready
  await page.click("text=Submit for feedback");
  await page.waitForURL("**/submissions/escalation-recommendation/feedback");

  await expect(page.getByText("Safety flag").first()).toBeVisible();
  await expect(page.getByText("Human review").first()).toBeVisible();
});

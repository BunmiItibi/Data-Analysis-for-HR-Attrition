import type { Meeting } from "@/lib/domain/types";

export const REQUIREMENTS_MEETING: Meeting = {
  id: "requirements-meeting",
  title: "Patient Access Portal — Requirements Review",
  purpose:
    "Confirm the scope of confirmations and reminders, resolve an open question about cancellation notice, and agree next steps before the build moves into its final sprint.",
  participants: ["Sarah Mitchell (chair)", "Lucy Thompson", "Daniel Reed", "Maya Patel", "You (Project Officer, taking notes)"],
  stage: "requirements_meeting",
  agenda: [
    { title: "Confirmation and reminder timing", owner: "Lucy Thompson" },
    { title: "Cancellation notice period", owner: "Lucy Thompson" },
    { title: "Mobile usability follow-up", owner: "Maya Patel" },
    { title: "Contact-detail update scope", owner: "Daniel Reed" },
    { title: "AOB", owner: "Sarah Mitchell" },
  ],
  transcript: [
    { speaker: "Sarah Mitchell", line: "Let's keep this tight — thirty minutes. Lucy, you wanted to start with confirmations and reminders." },
    {
      speaker: "Lucy Thompson",
      line: "Yes. Reception have asked for confirmation emails to go out immediately when a patient views or changes an appointment, and a reminder 48 hours before. That's the two we agreed at kickoff.",
    },
    { speaker: "Daniel Reed", line: "Both are built. Confirmation is triggered on save, reminder is a scheduled job at the 48-hour mark. Both went to Rachel's team with this build." },
    { speaker: "Lucy Thompson", line: "Good. Second thing — cancellations. Clinical ops want at least 24 hours' notice before a cancellation is accepted online, otherwise it goes to voluntary standby list instead of a straight cancel. Has that been built?" },
    { speaker: "Daniel Reed", line: "Not yet — we built a straight cancel with no notice check. That's a gap if it's a firm requirement." },
    { speaker: "Sarah Mitchell", line: "Is 24 hours firm, Lucy, or is that still under discussion with clinical ops?" },
    { speaker: "Lucy Thompson", line: "It's firm for the initial release. I raised it two weeks ago but I don't think it made it into the build spec — that's on us, not Daniel." },
    { speaker: "Sarah Mitchell", line: "Okay — that's a decision, not just an action. We're confirming the 24-hour cancellation rule as in-scope for this release. Daniel, can your team take that as a change for this sprint?" },
    { speaker: "Daniel Reed", line: "It's a small change — a notice-period check before the cancel completes. We can fit it in, but it needs to go in before the next test cycle starts, not after." },
    { speaker: "Sarah Mitchell", line: "Understood. Let's log that as an action with a hard date, not just a note." },
    { speaker: "Maya Patel", line: "While we're on cancellations — in usability testing this week, three of five participants struggled to find the cancel button on a phone screen. It's below the fold on smaller devices." },
    { speaker: "Lucy Thompson", line: "That matters — most patients will be on their phone, not a desktop." },
    { speaker: "Sarah Mitchell", line: "Agreed it's a real issue, but I don't want to make a redesign call in this meeting without seeing Maya's findings written up properly. Maya, can you get that to Daniel and me directly rather than us deciding it here?" },
    { speaker: "Maya Patel", line: "Yes — I'll have the write-up over by end of day tomorrow." },
    { speaker: "Sarah Mitchell", line: "Good — that's an action on Maya, not a decision today. Daniel, contact-detail updates — where are we?" },
    { speaker: "Daniel Reed", line: "Built for phone number and email. Lucy, is home address in scope? I've seen it mentioned twice but it's not in the original spec." },
    { speaker: "Lucy Thompson", line: "Good catch — no, address changes need an identity check we haven't built, so that's out of scope for this release. Phone and email only." },
    { speaker: "Sarah Mitchell", line: "So that's confirmed as-is, no action needed, just worth you noting it was raised and resolved so it doesn't come back as a surprise later." },
    { speaker: "Daniel Reed", line: "One more thing while we're all here — the reminder email service runs on a shared send queue with a few other Northstar products. Under load it can lag by up to a few hours. Not fixed for this release, we're accepting it as a known limitation for now." },
    { speaker: "Sarah Mitchell", line: "Noted — I want that written down properly, not just said in a meeting, in case it becomes a bigger deal once we're live. Right, that's our thirty minutes. Anything urgent for AOB?" },
    { speaker: "Lucy Thompson", line: "Nothing urgent from me — but I'd like the cancellation notice-period change confirmed to me in writing once it's actioned, since I'll need to update the clinical-ops team." },
    { speaker: "Sarah Mitchell", line: "That'll come out of the meeting summary. Thanks, everyone." },
  ],
  decisions: [
    {
      decision: "The 24-hour cancellation notice period is confirmed as in scope for this release.",
      rationale: "It is a firm clinical-operations requirement that was missed from the original build spec.",
    },
    {
      decision: "Home address updates remain out of scope for this release.",
      rationale: "Address changes require an identity check that has not been built; phone and email updates only.",
    },
  ],
  actions: [
    { action: "Build and test the 24-hour cancellation notice-period check before the next test cycle begins", owner: "Daniel Reed", dueInDays: 3 },
    { action: "Write up the mobile cancel-button usability finding and send directly to Sarah and Daniel", owner: "Maya Patel", dueInDays: 1 },
    { action: "Confirm the cancellation notice-period change to Lucy in writing once actioned", owner: "Sarah Mitchell", dueInDays: 4 },
  ],
};

export function getMeeting(id: string): Meeting {
  if (id !== REQUIREMENTS_MEETING.id) {
    throw new Error(`Unknown meeting: ${id}`);
  }
  return REQUIREMENTS_MEETING;
}

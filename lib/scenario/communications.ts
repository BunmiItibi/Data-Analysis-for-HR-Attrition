import type { Communication } from "@/lib/domain/types";

export const COMMUNICATIONS: Communication[] = [
  {
    id: "email-sarah-welcome",
    kind: "email",
    fromCharacterId: "sarah-mitchell",
    subject: "Welcome to Northstar — a few things before we start",
    sentAtStageStart: "briefing",
    requiresReply: true,
    threadId: "welcome",
    bodyMarkdown: `Hi, and welcome to the Patient Access Portal project.

I'm glad to have another pair of hands on this. Quick orientation: we're four weeks from a go-live decision, the team is stretched, and I need someone I can trust to keep our records straight and flag things early — that's you.

Three things to know from day one:

1. I'd rather hear about a problem too early than too late. If something looks wrong, tell me, even if you're not sure yet.
2. I own the day-to-day delivery calls. Scope, budget and go-live sit with the Project Board — if you ever think a decision needs that level, say so and I'll take it forward.
3. This is a fictional project, but I'll treat your work the way I'd treat a real Project Officer's — clear records, honest updates, and follow-through.

Take a look at the Project Overview I've attached, then reply here and introduce yourself — what's brought you to project work, and anything I should know as we get going.

Sarah`,
    attachments: [
      { label: "Project Overview", description: "One-page briefing on the Patient Access Portal — problem, objectives, scope and constraints." },
    ],
  },
  {
    id: "email-sophie-admin",
    kind: "email",
    fromCharacterId: "sophie-clark",
    subject: "Where everything lives",
    sentAtStageStart: "briefing",
    requiresReply: false,
    bodyMarkdown: `Hi! I'm Sophie — I keep the project's records straight and I'm usually the fastest way to find something.

A couple of pointers for your first few days:
- Meeting notes and actions go in the project record, not just in your inbox — Sarah checks it, not her email history.
- If you're ever not sure who owns a decision, ask. Better a two-line question than a wrong guess.
- I'm around for anything admin — no question is too small.

Good luck with the requirements meeting, it's a lively one.`,
  },
  {
    id: "email-sarah-meeting-invite",
    kind: "email",
    fromCharacterId: "sarah-mitchell",
    subject: "Requirements meeting — I need a clean summary afterwards",
    sentAtStageStart: "requirements_meeting",
    requiresReply: false,
    bodyMarkdown: `The requirements meeting notes are in — have a read through.

Once you've been through it, I need a short requirements summary from you: what we decided, what's still open, and the actions with owners and dates. Lucy and Daniel will both work from whatever you write, so it needs to be accurate, not just complete.

Don't editorialise — if something was left unresolved, say so rather than picking a side.`,
  },
  {
    id: "email-sarah-raid-request",
    kind: "email",
    fromCharacterId: "sarah-mitchell",
    subject: "Next up: get the RAID log started",
    sentAtStageStart: "raid_log",
    requiresReply: false,
    bodyMarkdown: `Good summary — thank you. Lucy already asked me a question the notes answered cleanly, so that's doing its job.

Now I need the RAID log opened up properly. Look back over what came out of the requirements meeting and the project overview: there are risks, at least one live issue, a few assumptions we're making, and dependencies on other teams. Capture them properly — type, description, owner, impact, and what we're doing about it.

I'd rather have five well-thought-through entries than fifteen thin ones.`,
  },
  {
    id: "email-daniel-dev-update",
    kind: "email",
    fromCharacterId: "daniel-reed",
    subject: "Dev update — build's with test now",
    sentAtStageStart: "testing_incident",
    requiresReply: false,
    bodyMarkdown: `Quick update from the build side: all four in-scope features are code-complete and the build has gone to Rachel's team for the test cycle.

Known before testing even started: the reminder email service is running on a shared queue, so under load it can lag — team is aware, not treating it as a launch blocker on its own, but flag it to me if the test report suggests otherwise.

Rachel's report should be with you shortly.`,
  },
  {
    id: "email-rachel-testing-report",
    kind: "email",
    fromCharacterId: "rachel-adams",
    subject: "Testing report ready — please review before we recommend anything",
    sentAtStageStart: "testing_incident",
    requiresReply: false,
    bodyMarkdown: `Testing report is attached. Five findings from this cycle, ranging from low severity to one I want you to look at closely.

I haven't sent a launch recommendation yet — I'd like a fresh pair of eyes on the full list first. Read the whole report, not just the top line, before you decide what matters most.`,
    attachments: [{ label: "Software Testing Report — Cycle 3", description: "Five defects found in this test cycle, with severity and evidence." }],
  },
];

export function getCommunication(id: string): Communication {
  const communication = COMMUNICATIONS.find((c) => c.id === id);
  if (!communication) {
    throw new Error(`Unknown communication: ${id}`);
  }
  return communication;
}

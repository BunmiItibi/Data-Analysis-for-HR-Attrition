import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { EXPERIENCE_SUMMARY } from "@/lib/scenario";
import { Card, CardHeading } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-6 py-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Simulated work experience</p>
        <h1 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
          Prove you can do the job — before you have the job.
        </h1>
        <p className="mx-auto max-w-2xl text-balance text-base text-text-muted">
          Experix puts you inside a realistic software project as a Project Officer. You’ll join a fictional
          healthcare technology team, do real coordination and analysis work, respond to a live delivery
          problem, get manager-style feedback, and leave with evidence you can actually show an employer.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={user ? "/dashboard" : "/register"}>
            {user ? "Continue your placement" : "Start the placement"}
          </ButtonLink>
          {!user && (
            <Link href="/login" className="text-sm font-medium text-text hover:underline">
              Already have an account? Sign in
            </Link>
          )}
        </div>
        <p className="text-xs text-text-muted">
          Takes about 2–3 hours. Entirely simulated — see the disclosure below.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeading>What you’ll do</CardHeading>
          <p className="mt-2 text-sm text-text-muted">
            Join {EXPERIENCE_SUMMARY.organisation} as their {EXPERIENCE_SUMMARY.roleTitle} on the{" "}
            {EXPERIENCE_SUMMARY.project}. Read real workplace emails, review a requirements meeting,
            maintain project records, and handle a serious testing incident — the way an entry-level
            Project Officer actually would.
          </p>
        </Card>
        <Card>
          <CardHeading>What you’ll produce</CardHeading>
          <p className="mt-2 text-sm text-text-muted">
            A requirements summary, a RAID log, and a privacy-incident escalation and launch-readiness
            recommendation — each reviewed, given specific feedback, and revised by you.
          </p>
        </Card>
        <Card>
          <CardHeading>What you’ll leave with</CardHeading>
          <p className="mt-2 text-sm text-text-muted">
            A developmental Experience Score across ten workplace competencies, with evidence for every
            score, and a portfolio preview you can talk through in an interview.
          </p>
        </Card>
      </section>

      <section className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm text-text">
        <p className="font-semibold text-navy">This is simulated work experience, not employment.</p>
        <p className="mt-1 text-text-muted">
          Northstar Health Digital, its project, and every colleague you meet are fictional. Completing this
          placement does not represent employment by, or endorsement from, any real organisation, and it is
          not a formal accreditation. It is structured practice designed to produce evidence you can discuss
          with a real employer.
        </p>
      </section>
    </div>
  );
}

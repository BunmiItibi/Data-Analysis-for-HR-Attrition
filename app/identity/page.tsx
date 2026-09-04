import { requireUser } from "@/lib/auth/session";
import { Card, CardHeading } from "@/components/ui/Card";
import { IdentityForm } from "@/components/identity/IdentityForm";

export default async function IdentityPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-navy">Your Experience Identity</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        A couple of quick questions so your placement and feedback are grounded in what you’re actually
        trying to achieve.
      </p>
      <Card>
        <CardHeading>Tell us about your goal</CardHeading>
        <div className="mt-4">
          <IdentityForm />
        </div>
      </Card>
    </div>
  );
}

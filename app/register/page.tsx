import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Card, CardHeading } from "@/components/ui/Card";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeading>Create your account</CardHeading>
        <p className="mt-1 mb-5 text-sm text-text-muted">Takes a minute. No CV screening — everyone starts here.</p>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardHeading } from "@/components/ui/Card";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeading>Sign in</CardHeading>
        <p className="mt-1 mb-5 text-sm text-text-muted">Welcome back to your placement.</p>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-text-muted">
          New here?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}

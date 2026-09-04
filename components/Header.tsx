import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-navy">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
          Experix
        </Link>
        {user ? (
          <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
            <Link href="/dashboard" className="rounded-md px-3 py-2 text-text hover:bg-bg">
              Dashboard
            </Link>
            <Link href="/inbox" className="rounded-md px-3 py-2 text-text hover:bg-bg">
              Inbox
            </Link>
            <Link href="/portfolio" className="rounded-md px-3 py-2 text-text hover:bg-bg">
              Portfolio
            </Link>
            <span className="mx-2 hidden text-text-muted sm:inline">{user.fullName}</span>
            <form action={logoutAction}>
              <Button variant="ghost" type="submit" className="px-3 py-2">
                Sign out
              </Button>
            </form>
          </nav>
        ) : (
          <nav className="flex items-center gap-2" aria-label="Primary">
            <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium text-text hover:bg-bg">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-contrast hover:bg-primary-hover"
            >
              Get started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

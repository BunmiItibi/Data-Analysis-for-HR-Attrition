import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-base font-semibold text-text ${className}`}>{children}</h2>;
}

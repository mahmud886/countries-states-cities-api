import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function StatCard(props: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: "primary" | "secondary" | "tertiary" | "neutral";
}) {
  const accent =
    props.accent === "primary"
      ? "bg-[var(--primary)]"
      : props.accent === "secondary"
        ? "bg-[var(--secondary)]"
        : props.accent === "tertiary"
          ? "bg-[var(--tertiary)]"
          : "bg-[var(--border)]";

  return (
    <Card className="relative overflow-hidden">
      <div className="px-5 py-5">
        <div className="text-xs text-[var(--text-muted)]">{props.label}</div>
        <div className="mt-2 text-2xl font-semibold text-[var(--text)]">
          {props.value}
        </div>
        {props.hint ? (
          <div className="mt-2 text-xs text-[var(--text-muted)]">
            {props.hint}
          </div>
        ) : null}
      </div>
      <div className={`absolute right-0 top-0 h-full w-1 ${accent}`} />
    </Card>
  );
}

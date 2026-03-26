import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:opacity-95",
  secondary:
    "bg-[var(--surface-2)] text-[var(--text)] shadow-sm hover:opacity-95",
  outline:
    "border bg-[var(--surface)] text-[var(--text)] shadow-sm hover:bg-[var(--surface-2)]",
  ghost: "text-[var(--text)] hover:bg-[var(--surface-2)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
};

export function Button(
  props: {
    variant?: Variant;
    size?: Size;
    className?: string;
  } & ComponentProps<"button">,
) {
  const { variant = "outline", size = "md", className, ...rest } = props;
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...rest}
    />
  );
}

export function ButtonLink(
  props: {
    href: string;
    variant?: Variant;
    size?: Size;
    className?: string;
  } & Omit<ComponentProps<typeof Link>, "href">,
) {
  const { href, variant = "outline", size = "md", className, ...rest } = props;
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      {...rest}
    />
  );
}

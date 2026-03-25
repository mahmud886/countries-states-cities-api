import { headers } from "next/headers";

export async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

export async function internalApiUrl(pathname: string, queryString?: string) {
  const base = await getBaseUrl();
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const qs = queryString?.trim();
  if (!qs) return `${base}${cleanPath}`;
  return `${base}${cleanPath}?${qs}`;
}

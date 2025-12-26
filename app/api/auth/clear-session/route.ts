import { NextResponse } from "next/server";

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return [];
  return cookieHeader
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const names = parseCookieHeader(cookieHeader);

  const res = NextResponse.json({ ok: true });

  for (const name of names) {
    try {
      res.cookies.set({ name, value: "", path: "/", maxAge: 0 });
    } catch (e) {
      // ignore
    }
  }

  return res;
}

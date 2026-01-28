import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

async function authMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

export default async function proxy(req: NextRequest) {
  const protectedPaths = [
    "/admin",
    "/api/upload-local",
    "/api/delete-local",
    // ... cualquier otra ruta de API que deba estar protegida
  ];

  // No proteger descarga de archivos públicos (GET /api/uploads/*)
  const isPublicUploadGet =
    req.method === "GET" && req.nextUrl.pathname.startsWith("/api/uploads");

  const shouldProtect =
    !isPublicUploadGet &&
    protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (shouldProtect) {
    return authMiddleware(req);
  }

  return NextResponse.next();
}

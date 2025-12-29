import { auth } from "@/lib/auth";
import * as fs from "fs/promises";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as path from "path";

export async function DELETE(request: NextRequest) {
  try {
    
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
      return NextResponse.json({ message: "No autenticado." }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ message: "Acceso denegado: se requieren permisos de administrador." }, { status: 403 });
    }

    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { message: "Falta la clave del archivo." },
        { status: 400 },
      );
    }

    if (typeof key !== "string" || key.length === 0 || key.includes("\0")) {
      return NextResponse.json(
        { message: "Clave inválida." },
        { status: 400 },
      );
    }

    // Reject URLs or blob URIs
    if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("blob:")) {
      return NextResponse.json({ message: "Clave inválida." }, { status: 400 });
    }

    // Normalize key: strip leading slashes so '/uploads/x' -> 'uploads/x'
    const safeKey = key.replace(/^\/+/, "");

    const publicDir = path.resolve(process.cwd(), "public");
    const targetPath = path.resolve(publicDir, safeKey);

    const relative = path.relative(publicDir, targetPath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return NextResponse.json(
        { message: "Acceso no permitido." },
        { status: 400 },
      );
    }

    // Confirm target exists and is a file (not directory or symlink to outside).
    try {
      const stats = await fs.stat(targetPath);
      if (!stats.isFile()) {
        return NextResponse.json(
          { message: "El objetivo no es un archivo válido." },
          { status: 400 },
        );
      }
    } catch (e) {
      return NextResponse.json(
        { message: "El archivo desapareció." },
        { status: 200 },
      );
    }

    await fs.unlink(targetPath);

    return NextResponse.json(
      { message: "Archivo eliminado exitosamente." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Local delete error:", error);
    return NextResponse.json(
      { message: "No se pudo eliminar el archivo localmente." },
      { status: 500 },
    );
  }
}

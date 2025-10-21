import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  // Extraer el archivo desde la URL usando request.url
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const file = segments[segments.length - 1]; // obtiene el [file] dinámico

  const filePath = path.join(process.cwd(), "public/uploads", file);

  if (!fs.existsSync(filePath)) {
    return new Response("Archivo no encontrado", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".mp4"
      ? "video/mp4"
      : ext === ".webm"
        ? "video/webm"
        : ext === ".ogg"
          ? "video/ogg"
          : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : ext === ".png"
              ? "image/png"
              : "application/octet-stream";

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": mime,
      "Accept-Ranges": "bytes",
    },
  });
}

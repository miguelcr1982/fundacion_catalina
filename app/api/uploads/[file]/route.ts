import fs from "fs";
import mime from "mime-types";
import path from "path";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const file = segments[segments.length - 1];

  const filePath = path.join(process.cwd(), "public/uploads", file);

  if (!fs.existsSync(filePath)) {
    return new Response("Archivo no encontrado", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = mime.lookup(filePath) || "application/octet-stream";

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": fileBuffer.length.toString(),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}

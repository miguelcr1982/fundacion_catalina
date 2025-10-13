import * as fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileTypeAccepted = formData.get("fileTypeAccepted") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileExtension = path.extname(file.name);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;

    const filePath = path.join(UPLOAD_DIR, uniqueFileName);
    const publicPath = `/uploads/${uniqueFileName}`;

    await fs.writeFile(filePath, buffer);

    return NextResponse.json(
      { message: "File uploaded successfully", key: publicPath },
      { status: 200 },
    );
  } catch (error) {
    console.error("Local upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload file locally." },
      { status: 500 },
    );
  }
}

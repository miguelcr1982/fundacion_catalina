import * as fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import * as path from "path";

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { message: "File key is missing." },
        { status: 400 },
      );
    }

    const absolutePath = path.join(process.cwd(), "public", key);

    try {
      await fs.access(absolutePath);
    } catch (e) {
      return NextResponse.json(
        { message: "File already gone." },
        { status: 200 },
      );
    }

    await fs.unlink(absolutePath);

    return NextResponse.json(
      { message: "File deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Local delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete file locally." },
      { status: 500 },
    );
  }
}

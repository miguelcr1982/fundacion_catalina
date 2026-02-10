import { getAllCourses } from "@/app/data/course/get-all-courses";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await getAllCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Error fetching courses" },
      { status: 500 },
    );
  }
}

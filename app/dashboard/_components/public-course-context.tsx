"use client";

import { createContext, useContext } from "react";

interface PublicCourseContextType {
  isPublicCourse: boolean;
}

const PublicCourseContext = createContext<PublicCourseContextType | undefined>(
  undefined,
);

export function PublicCourseProvider({
  children,
  isPublicCourse,
}: {
  children: React.ReactNode;
  isPublicCourse: boolean;
}) {
  return (
    <PublicCourseContext.Provider value={{ isPublicCourse }}>
      {children}
    </PublicCourseContext.Provider>
  );
}

export function usePublicCourse() {
  const context = useContext(PublicCourseContext);
  if (context === undefined) {
    return { isPublicCourse: false };
  }
  return context;
}
